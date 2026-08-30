# Cynos Rules 项目理解

> 本文件由 Cynos 项目理解流程维护。

## 项目目标

Cynos Rules 提供一组简短、直接、技术栈无关的工程与沟通规则，以及 Cynos 默认项目文件和 Git 组织约定。使用者不安装软件，只需让 AI 把 `AGENTS.md` 和 `docs/rules/**` 合并到目标项目的对应位置。

## 主要用户

- 希望为编程 AI 建立基础工作规范的项目负责人；
- 需要在陌生项目中安装或更新通用规则的 AI；
- 使用 Cynos 需求流程或罗网场景测试文件约定的项目。

## 产品边界

项目只维护 Markdown 规则和 README 安装提示词，不提供 npm 包、SDK、CLI、Pi/Harness Adapter、运行时注入、规则 Manifest、评测平台或模型绑定。

目标项目已有规则优先保留。安装 AI 必须合并而不是覆盖；目标平台不支持 `AGENTS.md` 时，由该平台 AI 选择原生规则入口，并让它引用 `docs/rules/**`。平台规则入口中的 Cynos 内容使用带版本的托管区块，更新只能替换确认属于 Cynos 的旧内容，区块外项目内容不得改写。

## 关键约定

- 工程规则优先整理自 `~/文档/java-taro-rules/` 的技术栈无关内容，不沿用旧 Cynos Rules 的抽象注入和评测设计；
- 沟通规则默认适用于大部分面向用户的自然语言回复，只规定如何简洁、完整地组织输出，不引入对话工作流；其核心参考 Cynos Guidance v0.1 和 Caveman 的精确压缩、清晰度保护思想；
- 根 `AGENTS.md` 只有 `cynos-rules:begin/end` 托管区块可以安装到目标项目；首次安装保留入口原文，更新通过旧 tag 区分上游旧内容与本地修改；
- 整套规则使用一个 SemVer 版本，目标项目通过 `docs/rules/VERSION` 记录已安装版本；未带版本但使用旧 `java-taro-rules` 结构的项目视为迁移基线 v0，其仍有效的技术栈规则必须保留；
- 项目文件规范来自 Cynos 默认项目文件架构约定；
- 正式分支和开发分支需要明确，默认使用 `main` 和 `develop`；短期分支和 Commit 使用 `feat`、`fix`、`docs` 等类型；是否使用 Pull Request 由项目负责人决定；
- 本仓库当前采用：短期分支由操作者直接 merge 到 `develop`，只有 `develop → main` 发布使用 Pull Request；
- 整理旧文档前必须询问用户并展示移动计划；只有过时或已被替代的文档进入 `docs/archive/`，仍有效但无法归类的文档保留原位；
- 不为了目录完整创建空目录或空文件。

## 历史决定

仓库曾计划提供 `@cynos-ai/rules`、Pi Adapter 和 Harbor 评测，但从未发布 npm 版本或 GitHub Release。该设计已废弃，历史保留在 Git tag `archive/evidence-rules-v0`，不再维护。这里的旧 Runtime 设计 tag 与项目规则迁移基线 v0 是两件事：前者只用于查阅仓库历史，后者表示尚未采用版本文件的 `java-taro-rules` 类项目规则。
