# Development Behavior Rules

## Before Making Changes

- First find related changes in the project's designated requirements location (default: `docs/changes/`). If a matching record exists, read its intent/spec/plan and check its completion status against the [requirements artifact rules](project-layout.md#completion-and-later-changes) to decide whether to continue it or create a new change.
- Read the relevant code, callers, tests, types, and configuration to confirm current behavior.
- If behavior is unclear, keep looking for evidence; do not guess from filenames, comments, or experience.
- Before adding a module, type, tool, component, or dependency, search the project for an existing owner or reusable implementation.
- First state the outcome sought, constraints, and explicit non-goals of the current task. Ask the user only about questions that affect product behavior, security, data, cost, or an irreversible direction.

## While Making Changes

- Follow the project's existing structure and coding style. A theoretically better approach is not, by itself, a reason to replace a stable practice.
- Change only what is needed for the current task. Do not also standardize style, refactor unrelated modules, or upgrade dependencies.
- Prefer placing behavior where its responsibility already belongs; do not duplicate rules or bypass existing responsibilities.
- Make small changes, keeping code and data understandable and recoverable at each step.
- Do not introduce abstractions for hypothetical multi-tenancy, concurrency, extension points, or future needs.
- Do not pass off TODOs, empty implementations, fixed fake data, or mocks as completed core capabilities.
- Handle errors explicitly; do not silently swallow them, use empty catch blocks, or disguise failure as success.

## Handling Different Tasks

### Bug Fixes

1. Reproduce the issue or obtain enough evidence to confirm it;
2. Make changes only after finding a credible root cause;
3. Change only one main factor at a time;
4. Add regression tests when the project has suitable testing capabilities, to prevent recurrence of the same kind of issue.

### Refactoring

- First identify which external behaviors must remain unchanged;
- Work under the protection of existing tests or equivalent evidence;
- Move one responsibility boundary at a time, without mixing in feature changes.

### Performance Optimization

- Measure first and confirm the bottleneck;
- Compare before and after under the same conditions;
- Do not add long-term complexity for gains too small to observe.

### Data, Schema, API, Configuration, or Dependency Migration

- Specify forward migration, compatibility, and rollback approaches;
- Protect existing data; repeated execution must not cause additional damage;
- Verify the states before, during, and after migration.

## Completion Criteria

- Perform the smallest sufficient verification that demonstrates this task's result; higher risk requires more comprehensive verification.
- Distinguish observed results, reasonable inferences, work not yet performed, unavailable verification, and blocked results.
- A successful build does not establish functional completion; passing with a test double does not establish successful integration with a real external system.
- Stop once the user's requirements are met; do not continue with adjacent optimization or cleanup.
