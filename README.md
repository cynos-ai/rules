# Cynos Rules

English | [简体中文](README.zh-CN.md)

Plain Markdown rules for coding assistants: communication, engineering practices, and project workflows. Ask your assistant to merge them into your project—there is no package to install.

The rule files and update guide are currently written in Chinese. This README is available in English and Simplified Chinese.

## Quick start

Use a coding assistant that can read and edit your project and access GitHub. For a first installation or an older project without the update guide and its routing entry, give it this prompt:

```text
Install or update Cynos Rules in this project from the latest stable GitHub Release at
https://github.com/cynos-ai/rules.

First read README.md at that release's tag. If docs/rules/update.md exists at that tag,
follow its workflow; otherwise follow the installation/update instructions in that tag's README.

Use only the released tag, preserve local project rules, and ask me about conflicts
before resolving them. Do not install software, reorganize existing documents,
commit, or publish.
```

The assistant selects the active project instruction file (`AGENTS.md`, `CLAUDE.md`, or the platform's equivalent), merges the rules into `docs/rules/`, and creates or updates `docs/PROJECT.md` from your project's actual code and documentation. It must not copy this repository's own project description.

Older projects need one upgrade to a release containing both the update guide and its routing entry before using the workflow below. Unreleased working-tree changes are not an installable release.

## Check or update later

Once the guide and routing entry are installed, ask your assistant:

| Request | Expected action |
|---|---|
| “Check whether Cynos Rules has an update.” | Check versions without changing project files. |
| “Update Cynos Rules in this project.” | Compare released versions and merge upstream changes, asking about conflicts. |

These are requests to your assistant, not shell commands. Markdown does not run itself: there are no startup checks, background reminders, or automatic upgrades, and recognition is not guaranteed across all AI platforms.

The complete installation and update workflow is maintained in one place: [docs/rules/update.md](docs/rules/update.md).

## Included rules

| File | Purpose |
|---|---|
| [communication.md](docs/rules/communication.md) | Concise, complete user-facing replies without overriding artifact-specific formats. |
| [behavior.md](docs/rules/behavior.md) | Investigation, implementation, debugging, refactoring, optimization, and completion. |
| [architecture.md](docs/rules/architecture.md) | Responsibilities, dependencies, interfaces, complexity, and high-risk changes. |
| [security.md](docs/rules/security.md) | Secrets, inputs, permissions, logs, data, and external systems. |
| [review.md](docs/rules/review.md) | Scope, correctness, safety, and verification before completion or commit. |
| [project-layout.md](docs/rules/project-layout.md) | Project context, Intent/Spec/Plan, document organization, and optional LuoWang scenario-testing assets. |
| [git.md](docs/rules/git.md) | Branch roles, short-lived branches, commits, and project-specific PR decisions. |
| [update.md](docs/rules/update.md) | User-requested version checks, installation, and safe updates. |
| [VERSION](docs/rules/VERSION) | The Rules version fully merged into the project. |

Project layout is documented in `project-layout.md`; no empty directories or placeholder files are required. Scenario-testing directories are only used with LuoWang, and archives are created only for real archived content.

## How updates protect project rules

Only the complete managed block from the upstream `AGENTS.md` is installed into the active instruction file—not this repository's surrounding instructions:

```markdown
<!-- cynos-rules:begin version=1.6.0 -->
## Cynos Rules
...
<!-- cynos-rules:end -->
```

- **Keep project-owned content.** First installation preserves the existing file and inserts the complete block. Content outside the block is never moved, reordered, rewritten, or reformatted.
- **Merge instead of overwriting.** An unchanged managed block can be replaced as a whole. Local edits require a three-way comparison of the old upstream tag, new upstream tag, and local content; project rules already inside the block stay there. Preserve extra rule files—never replace the entire `docs/rules/` directory.
- **Treat legacy content conservatively.** Unmarked 1.0/1.1 content can only be replaced when it exactly matches complete, contiguous old Cynos sections with clear boundaries; isolated matching lines are insufficient. v0 and content of unknown origin default to project ownership.
- **Stop on ambiguity.** Damaged or duplicate markers, inconsistent versions, unclear ownership, or substantive conflicts require user input. Update the block version and `docs/rules/VERSION` only after all rule content has been successfully merged and conflicts resolved.

Existing project and technology-stack conventions take precedence. Updating Rules does not authorize commits, merges, releases, or document reorganization; reorganizing documents requires a separate decision and approval of a file-by-file plan.

## Versions and migration

The whole rule set shares one [SemVer](https://semver.org/) version:

- **Major:** incompatible changes to rule responsibilities or file contracts.
- **Minor:** backward-compatible additions.
- **Patch:** corrections or clarifications that preserve rule intent.

Each formal release has a `v<version>` Git tag. The project's `docs/rules/VERSION` records the version fully merged into that project, not merely the version downloaded. Do not automatically downgrade a newer local version or overwrite local edits when versions match.

A project without `VERSION` that still uses the old `java-taro-rules` structure is a **v0 migration baseline**, not a formal Cynos Rules release. Its Java, Taro, deployment, command, and collaboration rules must be preserved during migration. Other unversioned content must be reviewed rather than assumed safe to overwrite.

See [CHANGELOG.md](CHANGELOG.md) for release changes and migration notes. The changelog is not copied into target projects.

## Scope and background

Rules are guidance, not a security sandbox or an enforced policy. The project provides no npm package, CLI, SDK, Harness Adapter, technology-stack template, runtime injection, rule manifest, benchmark platform, or model profile. It does not automatically discover or modify projects; rule-entry support depends on the AI platform.

Engineering guidance draws on the technology-independent parts of `java-taro-rules`. Communication guidance incorporates result-first, precise compression, and clarity-preservation principles from Cynos Guidance v0.1 and Caveman, alongside Cynos project-layout and Git conventions.

An earlier npm/Pi Adapter/evaluation design was archived without a formal release of that design. It remains at [archive/evidence-rules-v0](https://github.com/cynos-ai/rules/tree/archive/evidence-rules-v0) and is no longer maintained. That archive tag is unrelated to the `java-taro-rules` v0 migration baseline.

## License

[MIT](LICENSE)
