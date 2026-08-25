# Evaluation Guide

Status: **integration scaffold; no paid benchmark result has been claimed**

The [authoritative design](../DESIGN.md) defines the experiment. This guide explains how the repository delegates execution to Harbor instead of implementing an evaluation platform.

## Responsibilities

- Harbor resolves SWE-bench Verified tasks, creates containers, runs trials, records trajectories, and performs development scoring.
- `integrations/harbor` provides one thin installed-agent subclass that pins and isolates Pi and optionally loads the Cynos Rules CLI adapter.
- The upstream SWE-bench evaluator remains the release authority for Dev-30 and Confirm-100 patches.
- GitHub Issues and Pull Requests retain findings and rule decisions.

## Prerequisites

- Docker suitable for Harbor tasks;
- Node.js satisfying the root package requirements;
- `uv`;
- a DeepSeek official API key in `DEEPSEEK_API_KEY`;
- sufficient provider balance within the approved campaign ceiling.

Install and build the repository first:

```bash
npm ci --ignore-scripts
npm run check
npm run build

cd integrations/harbor
uv sync --frozen
```

Harbor is pinned to `0.22.0`; Pi is pinned to `0.84.3`.

## Isolation profile

`CynosRulesPi` always runs Pi with:

```text
--no-approve
--no-extensions
--no-skills
--no-prompt-templates
--no-context-files
```

It also uses an empty container-local `PI_CODING_AGENT_DIR`. The Rules-enabled condition explicitly loads only `dist/pi/cli.js`. Baseline and Candidate runs mount the same repository bytes read-only so the rule adapter is the only intended variable.

## Mount

From `integrations/harbor`, create a read-only mount value:

```bash
export RULES_ROOT="$(git rev-parse --show-toplevel)"
MOUNTS="$(python -c 'import json, os; print(json.dumps([{"type":"bind","source":os.environ["RULES_ROOT"],"target":"/opt/cynos-rules","read_only":True}]))')"
export MOUNTS
```

Do not mount `~/.pi`, a maintainer home directory, or a writable copy of this repository.

## One-task compatibility run

Before any campaign, select one pre-registered Pilot task and run exactly one attempt.

Baseline:

```bash
uv run harbor run \
  -d swe-bench/swe-bench-verified \
  -i '<task-name>' \
  -a cynos_rules_harbor.agent:CynosRulesPi \
  -m deepseek/deepseek-v4-flash \
  --ak version=0.84.3 \
  --ak thinking=low \
  --ak rules_enabled=false \
  --mounts "$MOUNTS" \
  -k 1 -n 1 \
  --jobs-dir results/pilot-baseline
```

Rules-enabled runs use the same command and change only:

```text
--ak rules_enabled=true
```

A Rules-enabled run requires a valid accepted or candidate `rules/manifest.json`, exact rule files, and a built `dist/` directory. The unreleased empty scaffold intentionally has no runtime manifest and cannot masquerade as a validated ruleset.

## Formal pairing

For a formal task pair:

- use the same task name;
- use the same model, Pi, thinking level, tools, timeout, environment, and evaluator;
- set `-k 1`;
- retain both Harbor job directories;
- never choose among retries or patches;
- classify pre-inference infrastructure failures separately from agent failures.

The committed campaign task lists will be generated only after the Baseline Pilot according to `DESIGN.md`. Do not select tasks ad hoc.

## Unattended execution

Harbor jobs do not require per-task human input. Run them in a trusted long-lived shell, CI `workflow_dispatch`, or trusted worker. A maintainer approves the campaign, model credential, task list, concurrency, and budget before launch.

The v0 integration records Pi JSON events, token usage, reported cost, and a `cynos-rules-profile.json` file containing the `rulesEnabled` arm plus the mounted Rules manifest in each trial's agent logs. Harbor's viewer can inspect completed jobs:

```bash
uv run harbor view results
```

The current thin integration does not replace Harbor with a custom scheduler or database.

## Cost and stop policy

Use the campaign ceiling in `DESIGN.md`. A campaign manifest must record the provider price snapshot and a conservative in-flight reserve before paid work starts. If the available Harbor execution mode cannot enforce the approved ceiling and completion policy, do not launch the paid campaign; first add or select a reviewed thin orchestration mechanism without changing the product boundary.

## Evidence

For release evidence:

1. retain Harbor `config.json`, `result.json`, trial results, Pi logs, patch artifacts, and manifest identity;
2. re-evaluate every Dev-30 and Confirm-100 patch with the official SWE-bench evaluator;
3. create one campaign-level Evaluation Finding Issue;
4. retain raw GitHub Actions Artifacts for 30 days;
5. attach the compact normalized evidence bundle to the release and record its SHA-256 digest.

Never expose model credentials, gold patches, hidden tests, or verifier internals to the agent.
