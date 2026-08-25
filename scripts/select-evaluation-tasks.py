#!/usr/bin/env python3
"""Select the frozen SWE-bench Verified v0 task sets deterministically.

The input is one Harbor task name per line. It contains task names only; it
must not contain task instructions, patches, tests, or solution material.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

TASK_RE = re.compile(r"^(?P<repo>.+)-(?P<number>[0-9]+)$")
SETS = (("pilot-5", 5), ("dev-30", 30), ("confirm-100-g1", 100))
SALT = "cynos-rules-v0"


def digest_task_ids(task_ids: list[str]) -> str:
    payload = "".join(f"{task}\n" for task in sorted(task_ids)).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def repo_for(task_id: str) -> str:
    match = TASK_RE.fullmatch(task_id)
    if match is None:
        raise ValueError(f"task ID does not end in a numeric issue ID: {task_id!r}")
    return match.group("repo")


def hamilton_counts(task_ids: list[str], requested: int) -> dict[str, int]:
    if requested < 0 or requested > len(task_ids):
        raise ValueError(f"requested {requested} tasks from {len(task_ids)} eligible tasks")
    by_repo = Counter(repo_for(task) for task in task_ids)
    total = len(task_ids)
    floors: dict[str, int] = {}
    remainders: list[tuple[float, str]] = []
    for repo, count in by_repo.items():
        quota = requested * count / total
        floor = int(quota)
        floors[repo] = floor
        remainders.append((quota - floor, repo))
    remaining = requested - sum(floors.values())
    for _, repo in sorted(remainders, key=lambda item: (-item[0], item[1]))[:remaining]:
        floors[repo] += 1
    return floors


def choose_set(task_ids: list[str], set_id: str, requested: int) -> list[str]:
    allocation = hamilton_counts(task_ids, requested)
    selected: list[str] = []
    for repo, count in sorted(allocation.items()):
        candidates = [task for task in task_ids if repo_for(task) == repo]
        candidates.sort(
            key=lambda task: (
                hashlib.sha256(f"{SALT}\n{set_id}\n{task}".encode("utf-8")).hexdigest(),
                task,
            )
        )
        selected.extend(candidates[:count])
    return sorted(selected)


def read_task_ids(path: Path) -> list[str]:
    task_ids = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    task_ids = [task for task in task_ids if task and not task.startswith("#")]
    if len(task_ids) != len(set(task_ids)):
        raise ValueError("input contains duplicate task IDs")
    for task in task_ids:
        repo_for(task)
    return sorted(task_ids)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--task-ids", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--dataset-name", default="swebench-verified")
    parser.add_argument("--dataset-version", default="1.0")
    parser.add_argument(
        "--source-commit",
        default="86723674f04e4209ac479d0fb75d9d9f44b4377e",
    )
    args = parser.parse_args()

    all_tasks = read_task_ids(args.task_ids)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    remaining = all_tasks[:]
    sets: dict[str, list[str]] = {}
    for set_id, requested in SETS:
        selected = choose_set(remaining, set_id, requested)
        if len(selected) != requested or set(selected) & (set(all_tasks) - set(remaining)):
            raise AssertionError(f"invalid selection for {set_id}")
        sets[set_id] = selected
        remaining = [task for task in remaining if task not in set(selected)]
        (args.output_dir / f"{set_id}.txt").write_text(
            "".join(f"{task}\n" for task in selected), encoding="utf-8"
        )

    manifest = {
        "schemaVersion": 1,
        "dataset": args.dataset_name,
        "version": args.dataset_version,
        "taskCount": len(all_tasks),
        "sourceRepository": "https://github.com/laude-institute/harbor-datasets.git",
        "sourceCommit": args.source_commit,
        "taskIdsSha256": digest_task_ids(all_tasks),
        "selectionSalt": SALT,
        "algorithm": "Hamilton largest-remainder by source repository; within repository ascending sha256(salt\\nsetId\\ntaskId), task ID tie-break",
        "sets": {
            set_id: {"count": len(tasks), "tasks": tasks} for set_id, tasks in sets.items()
        },
    }
    (args.output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(json.dumps({"taskIdsSha256": manifest["taskIdsSha256"], "sets": {k: len(v) for k, v in sets.items()}}, indent=2))


if __name__ == "__main__":
    main()
