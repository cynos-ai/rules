# Cynos Rules

[English](README.md) | 简体中文

供编程 AI 使用的纯 Markdown 规则，涵盖沟通、工程实践与项目工作流程。让 AI 将规则合并到你的项目即可，无需安装软件包。

规则正文、更新流程与入口托管区块只维护英文，README 提供英文和简体中文两版。面向用户的回复仍使用用户的主要语言。

## 快速开始

使用能够读写当前项目并访问 GitHub 的编程 AI。首次安装，或旧项目尚未包含更新文档与对应路由时，给 AI 下面这段提示词：

```text
请从 https://github.com/cynos-ai/rules 的最新正式 Release 安装或更新当前项目的 Cynos Rules。先读取该 Release 对应 tag 的 README.md；存在 docs/rules/update.md 时按其流程执行，不存在时沿用该 tag 的 README 安装/更新步骤。只使用正式 tag，保留本地项目规则，冲突先问；不安装软件，不顺手整理旧文档，也不提交或发布。
```

AI 会选择实际生效的项目规则入口（`AGENTS.md`、`CLAUDE.md` 或平台原生文件），将规则合并到 `docs/rules/`，并根据当前项目的实际代码和文档生成或更新 `docs/PROJECT.md`，不能复制本仓库自己的项目说明。

旧项目需要先升级一次，接入同时包含更新文档与路由的正式版本，才能使用下面的流程。工作区里尚未发布的修改不是可安装的正式版本。

## 日常检查与更新

接入更新文档和路由后，直接对 AI 说：

| 请求 | 预期操作 |
|---|---|
| “检查 Cynos Rules 有没有新版” | 只检查版本，不修改项目文件。 |
| “帮我更新 Cynos Rules” | 比较正式版本并合并上游变化，遇到冲突先询问。 |

这些是给 AI 的请求，不是终端命令。Markdown 不会自己运行：不做启动检查、后台提醒或自动升级，也不保证所有 AI 平台都能识别请求。

完整安装与更新流程只维护在 [docs/rules/update.md](docs/rules/update.md)。

## 规则导航

| 文件 | 用途 |
|---|---|
| [communication.md](docs/rules/communication.md) | 简洁、完整的用户沟通，不覆盖正式产物自身格式。 |
| [behavior.md](docs/rules/behavior.md) | 勘察、实施、Debug、重构、优化与完成标准。 |
| [architecture.md](docs/rules/architecture.md) | 职责、依赖、接口、复杂度与高风险变化。 |
| [security.md](docs/rules/security.md) | Secret、输入、权限、日志、数据与外部系统。 |
| [review.md](docs/rules/review.md) | 完成或提交前的范围、正确性、安全与验证检查。 |
| [project-layout.md](docs/rules/project-layout.md) | 项目理解、Intent/Spec/Plan、文档整理与可选的罗网场景测试资产。 |
| [git.md](docs/rules/git.md) | 分支职责、短期分支、Commit 与项目自己的 PR 决定。 |
| [update.md](docs/rules/update.md) | 按用户请求检查版本、安装与安全更新。 |
| [VERSION](docs/rules/VERSION) | 已完整合并到项目的 Rules 版本。 |

项目布局详见 `project-layout.md`，不要求创建空目录或占位文件。场景测试目录仅在接入罗网时使用，归档目录只为真实归档内容创建。

## 更新如何保护项目规则

只有上游 `AGENTS.md` 中的完整托管区块会安装到实际入口，不复制区块外的本仓库说明：

```markdown
<!-- cynos-rules:begin version=1.6.2 -->
## Cynos Rules
...
<!-- cynos-rules:end -->
```

- **保留项目内容。** 首次安装保留入口原文，插入完整区块。区块外内容不得移动、重排、改写或格式化。
- **合并而非覆盖。** 未被本地修改的区块可以整体替换；有本地修改时比较旧上游 tag、新上游 tag 和本地内容，区块内已有项目规则留在原位。保留额外规则文件，不整目录替换 `docs/rules/`。
- **谨慎处理旧内容。** 无标记的 1.0/1.1 内容只有逐字匹配完整、连续且边界清楚的旧 Cynos 章节时才能替换，单行匹配不算。v0 和未知来源内容默认属于目标项目。
- **不明确就停。** 标记损坏或重复、版本不一致、内容归属不明或实质冲突时，先询问用户。只有全部规则内容成功合并、冲突解决后，才同步托管区块版本与 `docs/rules/VERSION`。

已有项目和技术栈约定优先。更新 Rules 不等于授权提交、合并、发布或整理文档；整理文档需单独决定，并在逐文件计划获批后执行。

## 版本与迁移

整套规则共用一个 [SemVer](https://semver.org/) 版本：

- **主版本：** 规则职责或文件合同出现不兼容变化。
- **次版本：** 向后兼容地新增规则。
- **修订版本：** 不改变规则意图的修正和澄清。

每个正式版本对应 Git tag `v<version>`。项目中的 `docs/rules/VERSION` 记录已完整合并的版本，不是仅已下载的版本。本地版本领先时不自动降级；版本相同时不覆盖本地修改。

没有 `VERSION`、但沿用旧 `java-taro-rules` 结构的项目是 **v0 迁移基线**，不是 Cynos Rules 正式 Release。迁移时必须保留其中的 Java、Taro、部署、命令和协作规则。其他未版本化内容也须先盘点，不能假定可以覆盖。

版本变化与迁移说明见 [CHANGELOG.md](CHANGELOG.md)，不将 Changelog 复制到目标项目。

## 边界与背景

Rules 是指导，不是安全 Sandbox 或强制 Policy。本项目不提供 npm 包、CLI、SDK、Harness Adapter、技术栈模板、运行时注入、规则 Manifest、评测平台或模型 Profile。不自动发现或修改项目；规则入口支持情况取决于 AI 平台。

工程规则整理自 `java-taro-rules` 中与技术栈无关的部分；沟通规则吸收 Cynos Guidance v0.1 与 Caveman 的结果优先、精确压缩和清晰度保护原则，并结合 Cynos 项目文件与 Git 约定。

早期 npm/Pi Adapter/评测方案未正式发布便已归档，保留在 [archive/evidence-rules-v0](https://github.com/cynos-ai/rules/tree/archive/evidence-rules-v0)，不再维护。该归档 tag 与 `java-taro-rules` 的 v0 迁移基线无关。

## License

[MIT](LICENSE)
