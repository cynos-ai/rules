# Cynos Rules

一组可由 AI 安装到项目中的通用工程、沟通和项目文件规则。

Cynos Rules 只提供 Markdown，不需要安装 npm 包、CLI、SDK 或 Harness Adapter。工程规则主要整理自经过实际使用的 `java-taro-rules`，删除了 Java、Spring、Taro 等技术栈内容；沟通规则吸收 Cynos Guidance v0.1 与 Caveman 中结果优先、精确压缩和清晰度保护的核心思想；同时加入 Cynos 默认项目文件和 Git 约定。

## 包含内容

```text
AGENTS.md
CHANGELOG.md

docs/rules/
├── VERSION
├── communication.md
├── behavior.md
├── architecture.md
├── security.md
├── review.md
├── project-layout.md
├── git.md
└── update.md
```

- `VERSION`：目标项目当前已完整合并的 Rules 版本；
- `communication.md`：大部分用户沟通的简洁、完整输出组织；
- `behavior.md`：理解、修改、Debug、重构、优化和完成标准；
- `architecture.md`：职责、依赖、接口、复杂度和高风险变化；
- `security.md`：Secret、输入、权限、日志、数据和外部系统；
- `review.md`：提交前的范围、正确性、安全和验证检查；
- `project-layout.md`：PROJECT、需求三文件的职责与精简写作、罗网资产和旧文档整理；
- `git.md`：正式/开发分支、短期分支、Commit 和 PR 选择；
- `update.md`：按用户请求检查版本、安全安装或更新规则的完整流程；
- `CHANGELOG.md`：各版本变化和迁移说明，不复制到目标项目。

目标项目已有规则和技术栈约定不会被这些通用规则覆盖。

## 不覆盖项目规则入口

根 `AGENTS.md` 使用一个带版本的 Cynos 托管区块：

```markdown
<!-- cynos-rules:begin version=1.5.0 -->
## Cynos Rules
...
<!-- cynos-rules:end -->
```

安装到已有 `AGENTS.md`、`CLAUDE.md` 或其他平台规则文件时，AI 只插入或更新这个区块：

- 首次安装保留原文件全部内容，只加入完整区块；
- 区块未被本地修改时，可用新版本整体替换旧区块；
- 区块被本地修改时，比较旧 tag、新 tag 和本地内容后合并；
- 1.0/1.1 等无标记旧版本，只有逐字一致、连续且边界完整的旧 Cynos 章节才可替换，单行匹配不算；
- v0、未知来源和区块外内容默认属于目标项目，不删除、不移动、不重排；
- 标记损坏、重复、版本冲突或内容归属不明确时停止并询问用户。

## 版本

Cynos Rules 整套规则共用一个 [SemVer](https://semver.org/lang/zh-CN/) 版本：

- 主版本：规则职责或文件合同出现不兼容变化；
- 次版本：向后兼容地新增规则；
- 修订版本：不改变规则意图的修正和澄清。

每个正式版本对应 Git tag `v<version>`。目标项目通过 `docs/rules/VERSION` 记录已安装版本。更新时，AI 比较目标版本对应的上游 tag、新版本 tag 和目标项目本地修改，只合并上游变化，不能整目录覆盖。

没有 `VERSION`、但使用旧 `java-taro-rules` 结构的项目视为 **v0 迁移基线**。v0 不是本仓库的正式 Release，而是告诉更新 AI：这些文件中可能包含仍然有效的 Java、Taro、部署、命令和项目协作规则，升级时必须保留，不能只留下新的通用内容。

## 一句话检查或更新

安装了更新文档及对应入口路由后，直接对能够读取项目和访问 GitHub 的 AI 说：

- “检查 Cynos Rules 有没有新版”：只检查，不改项目文件。
- “帮我更新 Cynos Rules”：按流程比较版本并合并；有冲突时先询问，不覆盖项目自己的规则。

完整流程只维护在 [`docs/rules/update.md`](docs/rules/update.md)。普通 Markdown 不会自己运行，也不能保证所有 AI 平台都识别请求；本方案不做会话启动检查、后台提醒或自动升级。

### 首次安装或旧项目接入

尚未安装、缺少更新文档或没有新路由的项目，先给 AI 下面的短提示词。旧项目需要完成一次包含新入口的正式版本升级，之后才具备上述路由；工作区新增文档不代表它已经发布。

```text
请从 https://github.com/cynos-ai/rules 的最新正式 Release 安装或更新当前项目的 Cynos Rules。先读取该 Release 对应 tag 的 README.md；存在 docs/rules/update.md 时按其流程执行，不存在时沿用该 tag 的 README 安装/更新步骤。只使用正式 tag，保留本地项目规则，冲突先问；不安装软件，不顺手整理旧文档，也不提交或发布。
```

## 安装后的默认文件位置

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
│   ├── VERSION
│   ├── communication.md
│   └── update.md
├── changes/<change-id>/
│   ├── intent.md
│   ├── spec.md
│   └── plan.md
├── scenario-testing/       # 仅接入罗网时出现
└── archive/                # 仅有真实归档内容时出现
```

详细规则见 [`docs/rules/communication.md`](docs/rules/communication.md)、[`docs/rules/project-layout.md`](docs/rules/project-layout.md) 和 [`docs/rules/git.md`](docs/rules/git.md)。

## 设计边界

- Rules 是指导，不是安全 Sandbox 或强制 Policy；
- 不自动发现或修改用户项目；
- 不保证所有 AI 平台使用相同规则入口；
- 不提供技术栈模板；
- 不维护 Runtime 注入、Manifest、Benchmark 或模型 Profile；
- 版本用于帮助 AI 比较和合并，不提供自动更新程序，也不把本地规则变成上游的只读副本。

## 历史

本仓库曾探索 npm 包、Pi Adapter 和评测体系，但从未发布正式版本。旧方案保留在 Git tag [`archive/evidence-rules-v0`](https://github.com/cynos-ai/rules/tree/archive/evidence-rules-v0)，不再维护。这个 tag 与 `java-taro-rules` 的 v0 迁移基线无关。

## License

[MIT](LICENSE)
