# 项目文件规范

本规范只统一需要长期保存、供人类和 AI 共同使用的项目工件，不规定源码、构建产物、单元测试或部署代码的目录。

## 默认结构

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
│   ├── behavior.md
│   ├── architecture.md
│   ├── security.md
│   ├── review.md
│   ├── project-layout.md
│   └── git.md
├── changes/
│   └── <change-id>/
│       ├── intent.md
│       ├── spec.md
│       └── plan.md
├── scenario-testing/                 # 仅接入罗网时出现
│   ├── scenarios/
│   │   └── <SCENARIO-ID>.md
│   └── reports/
│       └── <run-id>/
│           ├── draft-report.md
│           ├── review.md
│           └── report.md
└── archive/                          # 仅存在真实归档内容时出现
```

`<platform-rule-entry>` 在支持时是根目录 `AGENTS.md`。平台不支持 `AGENTS.md` 时，使用平台原生项目规则文件，并让它引用 `docs/rules/**`。

不要为了目录完整创建空目录、空需求或占位报告。目录和文件在出现真实内容时再创建。

## `docs/PROJECT.md`

`PROJECT.md` 是 AI 使用的项目综合理解，不是目录索引或用户教程。它记录：

- 项目解决的问题和主要用户；
- 关键业务概念和跨模块流程；
- 主要系统边界和外部依赖；
- 不符合常规但属于有意设计的决定及原因；
- 容易被后续 AI 误判的约束和风险；
- 尚未确认的重要问题。

不应放入完整目录树、可直接从配置读取的值、冗长 API 清单、临时需求细节、测试运行记录或 Secret。

该文件由项目理解流程根据目标项目事实生成和更新。安装 Rules 时不能复制 Rules 仓库自己的 `docs/PROJECT.md`。

## 需求工件

每个需求使用稳定的 `<change-id>`：

```text
docs/changes/<change-id>/
├── intent.md
├── spec.md
└── plan.md
```

- `intent.md`：为什么做、期望结果、约束、不做什么和待确认问题；
- `spec.md`：已经确认的行为、数据、异常、集成和验收条件；
- `plan.md`：修改范围、实施顺序、风险和完成证明。

同一需求的三个文件放在同一个目录。默认不增加 `outcome.md`、`release.md` 或其他状态文件；出现真实需要后再决定。

## 罗网场景测试资产

只有接入罗网时才使用：

```text
docs/scenario-testing/scenarios/
docs/scenario-testing/reports/
```

场景平铺在 `scenarios/`，不建立 suite、catalog、domain 或 journey 目录。最小场景格式为：

```markdown
---
id: AUTH-LOGIN-001
name: 登录状态恢复
description: 验证用户登录后刷新受保护页面时仍保持登录状态
status: approved
tags:
  - core
  - module:认证
  - flow:登录
---

## 目的
...

## 前置条件
...

## 步骤
...

## 期望
...

## 需要记录
...
```

固定字段只有 `id`、`name`、`description`、`status`、`tags`。状态只有 `draft | approved | deprecated`，废弃场景保留文件并标记 `deprecated`，不物理删除历史。

每次正式 Run 在 `reports/<run-id>/` 保存 `draft-report.md`、`review.md` 和 `report.md`。详细执行日志、模型会话、临时计划和 Secret 不进入目标项目 Git。

## 整理已有文档

安装 Rules 不等于自动整理旧文件。AI 必须先询问用户是否采用本规范整理现有文档。

用户同意后：

1. 盘点现有文档并判断它们是否仍然有效；
2. 提供逐文件计划，标明“移动、合并、归档、保留、不确定”；
3. 说明合并会保留哪些内容，不能只给出目标目录；
4. 等用户确认后再使用 `git mv` 或等价方式操作；
5. 不删除无法归类的内容，不用新模板覆盖已有事实。

处理原则：

- 能明确归入 PROJECT、某个 change 或场景测试目录的有效内容，可以移动或合并；
- 仍然有效但不属于最小结构的 API、架构、部署、运维等文档保留原位；
- 只有已经过时、被替代或用户明确要求保留为历史的文档进入 `docs/archive/`；
- 是否归档不明确时先问用户；
- 归档时尽量保留原相对路径，避免同名覆盖。

## 不强制的内容

- 不规定源码、测试代码、构建和部署目录；
- 不要求文档目录 README 或手工索引；
- 不删除项目原有的有效架构、API、测试、部署或运维文档；
- 不把密码、Token、账号和环境 Secret 写入项目文件；
- 不要求没有使用罗网的项目创建 `scenario-testing/`。
