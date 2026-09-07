# Git Rules

## Branch Roles

The project should identify one release branch and one development integration branch. If there is no existing convention, default to:

```text
main       Release branch: only release-ready or released states
develop    Development integration branch: work for the next release
```

If the project already uses names such as `master` or `dev`, do not rename them automatically. Record which branch serves each role in the project rules.

Do not force-push the release or development branch. Do not commit routine features or fixes directly to the release branch.

## Short-Lived Branches

Start routine work on a clearly scoped short-lived branch from the latest development branch:

```text
feat/<short-name>       New feature
fix/<short-name>        Bug fix
docs/<short-name>       Documentation
refactor/<short-name>   Refactoring without behavior changes
test/<short-name>       Testing
chore/<short-name>      Repository maintenance
```

A short-lived branch handles one task; merge it into the development branch and delete it when complete. When ready to release, merge the development branch into the release branch.

If an urgent fix starts from the release branch, also synchronize the same fix back to the development branch after merging it into the release branch, so the two long-lived branches do not diverge on the old problem.

## Commits

Use a commit type that matches the nature of the change:

```text
feat: New feature
fix: Bug fix
docs: Documentation
refactor: Refactoring without behavior changes
test: Testing
chore: Repository maintenance
```

- Each commit expresses one thing;
- Do not mix features, fixes, refactoring, and unrelated formatting;
- Follow the project's language convention for descriptions;
- Do not require a scope, body template, signature, or particular merge strategy;
- Run the project-required checks before committing; do not commit known failing results.

## Pull Requests Are the User's Decision

Rules does not impose a universal Pull Request requirement. During project initialization or installation, the AI should ask:

> Are Pull Requests required when merging short-lived branches into the development branch and when merging the development branch into the release branch?

The user may choose:

- PRs for all merges;
- PRs only for releases to the release branch;
- No PRs; the operator merges directly.

The user may also decide the number of reviewers and whether to use merge, squash, or rebase. Record the decision outside the Cynos managed block in the target project's rule entry, or in `docs/PROJECT.md`; do not put project-specific decisions in a managed block that future upstream updates may replace. Subsequent AI assistants follow the decision without asking again. Until the user decides, the AI may work on a short-lived branch but must not independently merge into a long-lived branch.
