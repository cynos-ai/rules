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

## 不覆盖项目规则入口

根 `AGENTS.md` 使用一个带版本的 Cynos 托管区块：

```markdown
<!-- cynos-rules:begin version=1.2.0 -->
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
2. 读取 Cynos Rules 最新正式 tag 中的根 AGENTS.md、docs/rules/**、CHANGELOG.md 和 Git tags。只把 AGENTS.md 中 `cynos-rules:begin` 到 `cynos-rules:end` 的完整区块视为可安装内容，不复制区块外的 Rules 仓库说明。不要使用未发布的 develop 或短期分支。
3. 判断当前项目已安装版本：
   - 存在 docs/rules/VERSION 时，读取其中的 SemVer；
   - 没有 VERSION，但存在旧 java-taro-rules 风格的 AGENTS.md、behavior.md、architecture.md、conventions.md、frontend.md、backend.md 等规则时，视为 v0 迁移基线；
   - 没有 VERSION 且无法识别来源时，标记为“未版本化”，盘点内容后再合并，不能假定可以覆盖。
4. 如果目标版本高于最新正式版本，不自动降级，说明情况并停止；如果版本相同，只检查缺失或明确要求修复的内容，不覆盖本地修改。
5. 识别当前平台实际使用的项目规则入口：
   - 先读取已有 AGENTS.md、CLAUDE.md 和其他平台规则文件，以及它们之间的引用关系；
   - 平台支持 AGENTS.md 时优先使用根 AGENTS.md；不支持时选择平台原生入口，并让托管区块引用 docs/rules/**；
   - 多个入口并存时只修改确认生效的一个；已有入口引用链可以复用时不重复嵌入；
   - 无法确认生效入口时，说明判断和推荐方案并询问我。
6. 安装或更新平台规则入口：
   - 入口不存在时，创建平台原生文件并写入最新完整托管区块；
   - 入口已存在但没有 Cynos 标记、也没有可确认的旧 Cynos 版本时，保留原文并在不打断 Markdown 结构的位置原样加入最新完整托管区块；即使内容重复也不裁剪区块或用户原文，只报告重复或冲突；
   - 入口没有标记但 VERSION 指向 1.0/1.1 等旧 Cynos 版本时，读取对应 tag 的 AGENTS.md；只有逐字一致的完整旧 AGENTS，或带标题和完整正文、连续且边界清楚的旧 Cynos 章节，才能替换为新托管区块；单行和零散语句不能证明所有权；无法安全划定边界时不删除原文，先给出迁移计划并询问我；
   - 入口已有唯一完整托管区块时，读取区块版本；未本地修改则整体替换，存在本地修改则比较旧 tag、新 tag 和本地内容后合并；区块内已有项目规则作为本地修改留在原位置，不自动移到区块外；
   - begin/end 缺失一端、嵌套、重复、版本非法或区块版本与 VERSION 不一致时停止，不猜测修复；
   - 任何情况下都不移动、重排、改写或格式化托管区块之外的内容；实质冲突逐项列出并询问我。
7. 合并 docs/rules/**：
   - 从 v0 升级时保留 Java、Taro、前后端、部署、命令和其他项目特有规则；
   - 从正式版本更新时比较旧 tag、新 tag 和目标本地文件，保留本地新增和修改；
   - 保留目标项目已有的额外规则文件，不能整目录覆盖或删除未知文件；
   - communication.md 默认用于用户自然语言沟通，但不改变代码、文档、Commit、PR、Issue、报告和用户指定格式。
8. 只有平台规则入口和全部 docs/rules 内容成功合并、冲突已经解决后，才把托管区块版本和 docs/rules/VERSION 一起更新为新版本。失败或中途停止时保留原版本。
9. 根据当前项目代码和文档生成或更新 docs/PROJECT.md。不要复制 Cynos Rules 仓库自己的 docs/PROJECT.md。
10. 检查项目是否已经明确正式分支、开发分支、短期分支和 Commit 规则：
    - 没有既有约定时，推荐 main 为正式分支、develop 为开发分支；
    - 短期分支使用 feat/*、fix/*、docs/*、refactor/*、test/*、chore/*；
    - Commit 使用对应的 feat:、fix:、docs:、refactor:、test:、chore: 类型；
    - 已有其他分支名称时保留名称，只记录职责映射，不自动改名。
11. 如果项目尚未记录 PR 规则，只问我一个问题：
    “短期分支合入开发分支，以及开发分支合入正式分支时，是否要求 Pull Request？”
    给出三个选项：全部使用 PR、只有发布使用 PR、不使用 PR。把我的选择记录到目标项目的托管区块之外或 docs/PROJECT.md，不要替我决定。
12. 完成规则安装或更新后，单独询问我是否按照 docs/rules/project-layout.md 整理旧文档。没有得到同意前，不移动、合并、归档或删除任何旧文件。
13. 如果我同意整理，先输出逐文件计划，给每个文件标记：移动、合并、归档、保留或不确定，并说明目标位置和理由。等我再次确认后再操作。
14. 整理时遵守：
    - 使用 git mv 或等价方式保留历史；
    - 能明确归入 docs/PROJECT.md、docs/changes/<change-id>/** 或罗网目录的内容再移动/合并；
    - 仍有效但不属于最小结构的 API、架构、部署、运维等文档保留原位；
    - 只有过时、被替代或我明确要求保留为历史的内容进入 docs/archive/；
    - 不确定时询问，不能删除内容或用模板覆盖已有事实。
15. 修改完成后执行当前项目适用的检查，并报告：
    - 原版本、目标版本和最终写入版本；
    - 使用了哪个平台规则入口，区块外原内容是否保持不变；
    - 新增、替换、三方合并和保留了哪些通用及项目特有规则；
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
