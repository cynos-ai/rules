# Project File Conventions

These conventions standardize only long-lived project artifacts shared by humans and AI. They do not prescribe directories for source code, build artifacts, unit tests, or deployment code.

## Default Structure

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
│   ├── VERSION
│   ├── communication.md
│   ├── behavior.md
│   ├── architecture.md
│   ├── security.md
│   ├── review.md
│   ├── project-layout.md
│   ├── git.md
│   └── update.md
├── changes/
│   └── <change-id>/
│       ├── intent.md
│       ├── spec.md
│       └── plan.md
├── scenario-testing/                 # Only when integrated with LuoWang
│   ├── scenarios/
│   │   └── <SCENARIO-ID>.md
│   └── reports/
│       └── <run-id>/
│           ├── draft-report.md
│           ├── review.md
│           └── report.md
└── archive/                          # Only for actual archived content
```

`<platform-rule-entry>` is the root `AGENTS.md` when supported. If the platform does not support `AGENTS.md`, use its native project instruction file and have it reference `docs/rules/**`.

When installing into an existing rule entry, insert only the complete managed block between `cynos-rules:begin` and `cynos-rules:end` from the root `AGENTS.md`. Content outside the block belongs to the target project and must not be moved, reordered, rewritten, or reformatted. Subsequent updates replace only content confirmed to belong to an old Cynos version; local edits inside the block must also be merged, not overwritten. Put new project-specific rules outside the managed block; during updates, keep local rules already inside the block in their original positions rather than moving them automatically.

Do not create empty directories, empty requirements, or placeholder reports merely to complete the tree. Create directories and files only when there is real content.

`docs/rules/VERSION` is an exception: it must be written as part of installing Cynos Rules, for use in future updates. It contains only the SemVer version that has been fully merged. Additional project-specific technology-stack rules may remain in `docs/rules/`; Cynos Rules updates must not delete or overwrite those extra files.

## `docs/PROJECT.md`

`PROJECT.md` is the AI's integrated understanding of the project, not a directory index or user tutorial. It records:

- The problem the project solves and its primary users;
- Key business concepts and cross-module flows;
- Main system boundaries and external dependencies;
- Unconventional but intentional design decisions and their reasons;
- Constraints and risks that later AI assistants may misjudge;
- Important questions that remain unconfirmed.

This file should not include a full directory tree, values directly available from configuration, lengthy API lists, temporary requirement details, test-run records, or secrets.

Generate and update this file through the project-understanding process using facts from the target project. Do not copy the Rules repository's own `docs/PROJECT.md` when installing Rules.

## Requirements Artifacts

Use a stable `<change-id>` for each requirement. New requirement directories default to `YYYY-MM-DD-<short-name>`, for example `2026-09-07-change-directory-dates`:

- Use the date the requirement directory was first created; do not update it for edits, delays, or releases.
- `<short-name>` is a short, distinctive topic name; do not use a date alone.
- Follow an existing explicit naming convention or stable requirement ID instead when present; do not force a date prefix, add dates to existing directories, or rename them automatically.

```text
docs/changes/<change-id>/
├── intent.md
├── spec.md
└── plan.md
```

Keep the three files for a requirement in the same directory, but do not write three versions of the same document at different levels of detail:

| File | Primary reader and question to answer |
|---|---|
| `intent.md` | User: does this accurately express the problem I want to solve? |
| `spec.md` | Proposal reviewer: how will we solve it, what will the result look like, and is the approach suitable? |
| `plan.md` | Implementation AI: what are the phases, what changes in each, and how will completion be demonstrated? |

### `intent.md`: Original Intent and Necessary Context

- Preserve the user's original request and subsequent explicit additions, including desired outcomes, explicit constraints, and non-goals. Spoken phrasing and repetition may be cleaned up; there is no need to paste the entire conversation, but do not change its meaning or expand its scope independently.
- Separately label project context and system limitations needed to understand the request as project context. Distinguish verified facts, AI inferences, and open questions; do not pass off an AI-derived solution as a user requirement.
- Do not introduce implementation designs, code locations, or execution steps early. Retain technical requirements explicitly specified by the user and identify them as such.

### `spec.md`: A Proposal for Human Judgment

- Based on the Intent, explain the approach and the main changes it will produce; expand only on key design choices and trade-offs introduced or changed by this requirement.
- Keep enough key behavior and outcomes in the main flow and acceptance criteria to judge the proposal. Include agreements affecting product behavior, security, compatibility, data, and external collaboration, as well as important exceptions and failure consequences. If a public interface or data format is itself the requirement, define it here rather than leaving implementation to guess.
- Put item-by-item checks, test matrices, and verification steps in the Plan. Internal functions, file-by-file change lists, and test commands usually belong there too; do not turn the Spec into a code-investigation log or implementation manual.

### `plan.md`: Phased Implementation Details

- Write the Plan once the intent and key design decisions are stable enough. Divide work by dependencies and verifiable outcomes; a small requirement may have just one phase, without artificial subdivisions.
- For each phase, specify the goal, necessary change locations, implementation steps, and verification method. Add prerequisites, key risks, migration, or rollback requirements as needed. Give enough detail for an AI to implement using the Spec, project rules, and code without redeciding the product design; do not prewrite every function or code detail that can be determined during implementation.
- Retain only code-investigation conclusions needed for implementation. After implementation, briefly consolidate phase status, blockers, and necessary evidence locations; do not pile up command output, troubleshooting history, or repeated status declarations. Unverified results must not be marked complete.

<a id="完成与后续变更"></a>

### Completion and Later Changes

- During implementation, the original change may be revised within its current scope. Once all implementation and necessary verification for that scope are complete, record the result in the Plan; after that, preserve the original intent/spec/plan as history and do not rewrite them.
- Create a new change for every later addition, adjustment, or bug fix, referencing the original change and explaining what it builds on and what differs. A related topic is not a reason to append phases to a completed Plan or rewrite its old Spec.
- Record post-completion commits, merges, and releases in Git, PRs, or Releases, not back in the original change.

### Writing Requirements Shared by All Three Documents

- Start with the file's core content, not extensive background, terminology, or metadata.
- Choose sections for real content. Omit empty ones rather than mechanically filling a template or adding "none yet" placeholders; do not judge completeness by word count or number of items.
- Explain each fact in detail only in the file responsible for it; use brief references elsewhere, including from the Plan to the Spec's behavior and acceptance criteria. Do not repeat reused project capabilities, conventions, or general engineering, security, and Git rules; describe only this requirement's special needs.
- Keep unconfirmed matters pending and label recommendations as recommendations; do not decide independently that they are included or excluded. Explain what needs confirmation and its effects. Mark implementation steps that depend on the decision as conditional; independent phases may continue. Do not settle the decision implicitly in the Plan.

### Filter Before Writing, Trim Afterward

Before writing a paragraph, decide where it belongs:

- Intent: did the user say this, or is it project context necessary to understand the request?
- Spec: would removing this paragraph affect a human's judgment of whether this proposal is suitable?
- Plan: does this paragraph help an AI implement, avoid a specific mistake, or verify the result?

If none applies, omit it; do not transcribe every item merely because it appears in the source material.

After the first draft, trim again: combine duplicate requirements, move implementation details to the Plan, and remove empty claims such as "reliable," "complete," or "traceable," along with irrelevant defensive statements. Finally, confirm that user requirements, key conditions, exceptions, risks, and pending decisions were not removed or changed. Deliver the finished documents directly, without a writing-process or trimming report.

### Short Positive Example: Notification Read State

This fictional small requirement demonstrates information selection. It is not a mandatory template, length limit, or statement of facts about the target project. The actual project's complexity, security, and compatibility requirements still apply.

**intent.md**

```markdown
# Keep Notifications Read After Refresh

User request: marking an individual notification as read is lost after refreshing the page. Persist the read state for the current account only. Whether to add bulk marking is still undecided.

Project context: login, a notification list, and server-side notification storage already exist; read state currently lives only in page memory.
```

**spec.md**

```markdown
# Persisting Read State

Reuse existing notification storage to persist each notification's read state per account. Restore it after refresh or sign-in; the server checks notification ownership and rejects changes to another account's state.

Show a failure when saving fails; do not display the state as saved. Historical read state that cannot be recovered remains unread, without guessing. Bulk marking is still pending and does not block individual saves.

Acceptance: state survives refresh and sign-in; cross-account changes are rejected; failed saves do not produce false success; old notifications remain readable.
```

**plan.md**

```markdown
# Implementation Plan

## 1. Storage and Interfaces

Add per-account reads and writes of read state to the existing notification storage and interfaces, reusing authentication, authorization, and ownership checks. If migration is needed, keep an unread default for old records without backfilling unknown history.

Verification: tests for persistence, repeated marking, cross-account rejection, write failure, and old-record compatibility.

## 2. List Integration

Read server-side state in the notification list; update the page after an individual mark succeeds, and retain the previous state with an error message on failure.

Verification: UI tests for marking, refresh, sign-in, and save failure, checking the Spec's acceptance outcomes.

Add bulk-marking steps only after confirmation; it does not block these two phases.
```

Do not add `outcome.md`, `release.md`, or other status files by default; decide only when a real need arises.

## LuoWang Scenario-Testing Assets

Use these only when integrating with LuoWang:

```text
docs/scenario-testing/scenarios/
docs/scenario-testing/reports/
```

Keep scenarios flat in `scenarios/`; do not create suite, catalog, domain, or journey directories. The minimal scenario format is:

```markdown
---
id: AUTH-LOGIN-001
name: Restore Login State
description: Verify that the user remains signed in after refreshing a protected page
status: approved
tags:
  - core
  - module:认证
  - flow:登录
---

## Purpose
...

## Preconditions
...

## Steps
...

## Expectations
...

## Evidence to Record
...
```

The only fixed fields are `id`, `name`, `description`, `status`, and `tags`. The only statuses are `draft | approved | deprecated`; keep deprecated scenario files and mark them `deprecated` rather than physically deleting history.

For each formal Run, save `draft-report.md`, `review.md`, and `report.md` in `reports/<run-id>/`. Keep detailed execution logs, model sessions, temporary plans, and secrets out of the target project's Git repository.

## Organizing Existing Documents

Installing Rules does not authorize automatic reorganization of old files. The AI must first ask whether the user wants to apply these conventions to existing documents.

After the user agrees:

1. Inventory existing documents and assess whether they remain valid;
2. Provide a file-by-file plan marked "move, merge, archive, keep, or uncertain";
3. Explain which content a merge will preserve, not just the destination directory;
4. Wait for user confirmation before using `git mv` or an equivalent operation;
5. Do not delete unclassified content or overwrite existing facts with a new template.

Handling principles:

- Valid content clearly belonging in PROJECT, a specific change, or the scenario-testing directories may be moved or merged;
- Still-valid API, architecture, deployment, operations, and similar documents outside the minimal structure remain where they are;
- Only obsolete, superseded, or explicitly user-designated historical documents go into `docs/archive/`;
- Ask the user when archive eligibility is unclear;
- Preserve original relative paths where possible when archiving, to avoid overwriting same-named files.

## What Is Not Required

- No prescribed directories for source code, test code, builds, or deployment;
- No required documentation-directory README or manual index;
- No deletion of the project's existing valid architecture, API, testing, deployment, or operations documents;
- No passwords, tokens, accounts, or environment secrets in project files;
- No requirement to create `scenario-testing/` in projects that do not use LuoWang.
