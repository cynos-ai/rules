# AGENTS.md

本仓库维护技术栈无关的项目规则。当前版本记录在 `docs/rules/VERSION`。修改前先阅读 `docs/PROJECT.md`、当前需求目录和与任务相关的 `docs/rules/**`。

## 按任务读取

| 任务 | 读取 |
|---|---|
| 所有面向用户的自然语言回复 | `docs/rules/communication.md` |
| 写代码、修 Bug、重构、Debug、优化 | `docs/rules/behavior.md` |
| 架构、模块、依赖、迁移 | `docs/rules/architecture.md` |
| 认证、权限、Secret、输入、日志、外部数据 | `docs/rules/security.md` |
| 检查、测试、评审、准备提交 | `docs/rules/review.md` |
| 建立项目、整理文档、创建需求工件 | `docs/rules/project-layout.md` |
| 安装、更新或迁移 Rules | `README.md`、`CHANGELOG.md`、`docs/rules/VERSION` |
| 分支、Commit、合并、发布 | `docs/rules/git.md` |

## 每次任务的底线

- 面向用户先给直接答案、判断或结果，只补必要说明，不叙述无价值的工具过程。
- 先阅读相关代码、文档和测试，不能用猜测代替项目事实。
- 只处理当前目标，不顺手重构、升级依赖或扩大范围。
- 优先使用项目已有结构和能力，新增前先搜索。
- 修改后执行与风险匹配的验证；未执行、失败或不可用必须如实说明。
- 不提交密码、Token、私钥、`.env` 或其他 Secret，不在日志和错误中暴露它们。
- 遇到会改变产品行为、公共接口、安全、数据、成本或不可逆方向的选择时，一次只问用户一个关键问题，并提供推荐答案。

目标项目已有规则和明确用户决定优先。发生冲突时先指出冲突，不能静默覆盖。规则未覆盖的情况跟随项目已有做法。
