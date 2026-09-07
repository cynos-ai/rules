# AGENTS.md

本仓库维护技术栈无关的项目规则。当前版本记录在 `docs/rules/VERSION`。修改前先阅读 `docs/PROJECT.md`、当前需求目录和与任务相关的 `docs/rules/**`。安装到其他项目时只复制下面的 Cynos Rules 托管区块，不复制本段仓库说明。

<!-- cynos-rules:begin version=1.6.1 -->
## Cynos Rules

### Read by Task

| Task | Read |
|---|---|
| All user-facing natural-language replies | `docs/rules/communication.md` |
| Coding, bug fixes, refactoring, debugging, optimization | `docs/rules/behavior.md` |
| Architecture, modules, dependencies, migration | `docs/rules/architecture.md` |
| Authentication, authorization, secrets, input, logs, external data | `docs/rules/security.md` |
| Checks, tests, reviews, preparation for commits | `docs/rules/review.md` |
| Project setup, document organization, writing or revising requirements artifacts | `docs/rules/project-layout.md` |
| Installing, checking versions, updating, or migrating Cynos Rules | `docs/rules/update.md`; if absent, read `README.md` at the latest formal Release tag of `https://github.com/cynos-ai/rules` |
| Branches, commits, merges, releases | `docs/rules/git.md` |

For requests such as "Check the Cynos Rules version" or "Update Cynos Rules for me," read the update workflow based on the user's intent. Recognize similar expressions from context and clarify ambiguous references first. Checks are read-only; updates require a user request. Do not check automatically without a request.

### Baseline for Every Task

- Give the user a direct answer, judgment, or result first, with only necessary explanation and no unhelpful tool-process narration.
- Read relevant code, documentation, and tests first; do not substitute guesses for project facts.
- Handle only the current goal; do not also refactor, upgrade dependencies, or expand the scope.
- Prefer existing project structure and capabilities; search before adding anything new.
- After changes, perform risk-appropriate verification and honestly report checks not performed, failed, or unavailable.
- Do not commit passwords, tokens, private keys, `.env`, or other secrets, or expose them in logs and errors.
- When a choice would change product behavior, public interfaces, security, data, cost, or an irreversible direction, ask the user one key question at a time and provide a recommendation.

The target project's existing rules and explicit user decisions take precedence. Identify conflicts before proceeding; never silently overwrite them. Follow existing project practices where these rules do not cover a situation.
<!-- cynos-rules:end -->
