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
└── git.md
```

- `VERSION`：目标项目当前已完整合并的 Rules 版本；
- `communication.md`：大部分用户沟通的简洁、完整输出组织；
- `behavior.md`：理解、修改、Debug、重构、优化和完成标准；
- `architecture.md`：职责、依赖、接口、复杂度和高风险变化；
- `security.md`：Secret、输入、权限、日志、数据和外部系统；
- `review.md`：提交前的范围、正确性、安全和验证检查；
- `project-layout.md`：PROJECT、需求三文件、罗网资产和旧文档整理；
- `git.md`：正式/开发分支、短期分支、Commit 和 PR 选择；
- `CHANGELOG.md`：各版本变化和迁移说明，不复制到目标项目。

目标项目已有规则和技术栈约定不会被这些通用规则覆盖。

## 版本

Cynos Rules 整套规则共用一个 [SemVer](https://semver.org/lang/zh-CN/) 版本：

- 主版本：规则职责或文件合同出现不兼容变化；
- 次版本：向后兼容地新增规则；
- 修订版本：不改变规则意图的修正和澄清。

每个正式版本对应 Git tag `v<version>`。目标项目通过 `docs/rules/VERSION` 记录已安装版本。更新时，AI 比较目标版本对应的上游 tag、新版本 tag 和目标项目本地修改，只合并上游变化，不能整目录覆盖。

没有 `VERSION`、但使用旧 `java-taro-rules` 结构的项目视为 **v0 迁移基线**。v0 不是本仓库的正式 Release，而是告诉更新 AI：这些文件中可能包含仍然有效的 Java、Taro、部署、命令和项目协作规则，升级时必须保留，不能只留下新的通用内容。

## 交给 AI 的安装或更新提示词

复制下面整段内容给能够访问目标项目和本仓库的 AI：

```text
请从 https://github.com/cynos-ai/rules 的最新正式版本安装或更新当前项目的 Cynos Rules。

目标：
- 安装或更新 Cynos Rules 的平台规则入口、docs/rules/** 和 docs/rules/VERSION；
- 让大部分面向用户的自然语言回复默认参考 docs/rules/communication.md，同时保留正式产物自身格式；
- 保留当前项目已有的技术栈、命令、架构、安全和协作约定；
- 根据当前项目事实生成或更新 docs/PROJECT.md；
- 不安装 npm 包、CLI、SDK、Adapter 或运行时代码；
- 不创建没有真实内容的空目录和占位文件。

执行步骤：
1. 先阅读当前项目已有的项目规则、README、文档、代码结构、测试和 Git 分支，不要立即写文件。
2. 读取 Cynos Rules 最新正式 tag 中的 AGENTS.md、docs/rules/**，并读取根 CHANGELOG.md 和 Git tags。不要直接使用未发布的 develop 或短期分支。
3. 判断当前项目已安装版本：
   - 存在 docs/rules/VERSION 时，读取其中的 SemVer；
   - 没有 VERSION，但存在旧 java-taro-rules 风格的 AGENTS.md、behavior.md、architecture.md、conventions.md、frontend.md、backend.md 等规则时，视为 v0 迁移基线；
   - 没有 VERSION 且无法识别来源时，标记为“未版本化”，盘点内容后再合并，不能假定可以覆盖。
4. 如果目标版本已经高于最新正式版本，不自动降级，说明情况并停止；如果版本相同，只检查缺失或明确要求修复的内容，不覆盖本地修改。
5. 判断当前 AI 平台是否原生支持 AGENTS.md：
   - 支持时，合并到项目根 AGENTS.md，不能直接覆盖已有内容；
   - 不支持时，选择该平台原生的项目级规则入口，在其中保留项目规则并要求 AI 按任务读取 docs/rules/**；
   - 无法确认平台入口时，先说明判断和推荐方案并询问我。
6. 合并规则：
   - 从 v0 升级时，提取可由新版通用规则替代的部分，同时保留 Java、Taro、前后端、部署、命令和其他项目特有规则；
   - 从正式版本更新时，比较上游旧 tag → 新 tag 的变化，再把这些变化合并到当前项目，保留本地新增和修改；
   - 保留目标项目已有且更具体的规则和额外规则文件；
   - 在平台规则入口中把所有面向用户的自然语言回复路由到 docs/rules/communication.md，但不改变代码、文档、Commit、PR、Issue、报告和用户指定格式；
   - 遇到实质冲突时逐项列出并询问我，不能静默覆盖。
7. 只有 AGENTS/平台入口和全部 docs/rules 内容成功合并、冲突已经解决后，才把新版本写入 docs/rules/VERSION。失败或中途停止时保留原版本。
8. 根据当前项目代码和文档生成或更新 docs/PROJECT.md。不要复制 Cynos Rules 仓库自己的 docs/PROJECT.md。
9. 检查项目是否已经明确正式分支、开发分支、短期分支和 Commit 规则：
   - 没有既有约定时，推荐 main 为正式分支、develop 为开发分支；
   - 短期分支使用 feat/*、fix/*、docs/*、refactor/*、test/*、chore/*；
   - Commit 使用对应的 feat:、fix:、docs:、refactor:、test:、chore: 类型；
   - 已有其他分支名称时保留名称，只记录职责映射，不自动改名。
10. 如果项目尚未记录 PR 规则，只问我一个问题：
    “短期分支合入开发分支，以及开发分支合入正式分支时，是否要求 Pull Request？”
    给出三个选项：全部使用 PR、只有发布使用 PR、不使用 PR。把我的选择记录到目标项目的平台规则入口或 docs/PROJECT.md，不要替我决定。
11. 完成规则安装或更新后，单独询问我是否按照 docs/rules/project-layout.md 整理旧文档。没有得到同意前，不移动、合并、归档或删除任何旧文件。
12. 如果我同意整理，先输出逐文件计划，给每个文件标记：移动、合并、归档、保留或不确定，并说明目标位置和理由。等我再次确认后再操作。
13. 整理时遵守：
    - 使用 git mv 或等价方式保留历史；
    - 能明确归入 docs/PROJECT.md、docs/changes/<change-id>/** 或罗网目录的内容再移动/合并；
    - 仍有效但不属于最小结构的 API、架构、部署、运维等文档保留原位；
    - 只有过时、被替代或我明确要求保留为历史的内容进入 docs/archive/；
    - 不确定时询问，不能删除内容或用模板覆盖已有事实。
14. 修改完成后执行当前项目适用的检查，并报告：
    - 原版本、目标版本和最终写入版本；
    - 使用了哪个平台规则入口；
    - 新增、合并和保留了哪些通用及项目特有规则；
    - docs/PROJECT.md 如何生成或更新；
    - Git/PR 约定；
    - 移动、归档、保留和未处理的旧文档；
    - 已执行、未执行、失败或不可用的验证。
```

## 安装后的默认文件位置

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
│   ├── VERSION
│   └── communication.md
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
