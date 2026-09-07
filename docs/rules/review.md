# Review and Completion Checks

## Scope

- [ ] Changes cover only the current task, without unrelated refactoring, dependency upgrades, or broad reformatting.
- [ ] Existing implementations were searched before adding new ones, and responsibility remains in the right place.
- [ ] Public interface, configuration, data-format, and compatibility effects have been explained.
- [ ] Temporary debugging code, fixed fake data, unfinished TODOs, and obsolete entry points have been addressed.

## Correctness and Failure Paths

- [ ] Success, empty-data, error, interruption, and recovery behavior meet the requirements.
- [ ] Errors are handled explicitly, without empty catch blocks, silent failures, or false success.
- [ ] Bug fixes have reproduction evidence and regression tests where project conditions allow.
- [ ] Data, schema, configuration, or dependency migrations account for compatibility, retries, and rollback.

## Security

- [ ] Git diffs, logs, test snapshots, and examples contain no passwords, tokens, private keys, `.env`, or personal data.
- [ ] External input is validated at the trusted boundary, and sensitive operations are authenticated and authorized on the server.
- [ ] Database calls, commands, paths, and external requests do not concatenate untrusted input.
- [ ] New permissions, secrets, and network access do not exceed what the task requires.

## Verification

- [ ] Project checks appropriate to the risk have been run, such as formatting, type checks, relevant tests, or production builds; low-risk changes do not mechanically require every command, and inapplicable checks have explicit reasons.
- [ ] User-observable behavior has supporting evidence, not merely a successful build.
- [ ] Unverified external dependencies, real environments, or manual steps are explicitly marked as unverified or blocked.
- [ ] Verification failures have not been ignored, and the reported results match actual command output.
- [ ] The implementation selected an existing change or created a new one according to the [requirements artifact rules](project-layout.md#completion-and-later-changes); the current Plan's phase status and verification records match actual results, without rewriting completed historical changes.

## Git

- [ ] Branch sources and targets follow `git.md` and the project's own merge decisions.
- [ ] Commits are atomic and correctly typed, without mixing features, fixes, refactoring, and unrelated formatting.
- [ ] Neither the release branch nor the development branch has been force-pushed.

## Final Three Questions

1. Does this change really do only what is necessary?
2. Is there a simpler but equally complete approach?
3. In six months, can a maintainer understand why this was done from the code, documentation, and commit history?
