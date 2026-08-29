# Cynos Rules

一组可由 AI 安装到项目中的通用工程规则和项目文件约定。

Cynos Rules 只提供 Markdown，不需要安装 npm 包、CLI、SDK 或 Harness Adapter。规则主要整理自经过实际使用的 `java-taro-rules`，删除了 Java、Spring、Taro 等技术栈内容，并加入 Cynos 默认项目文件和 Git 约定。

## 包含内容

```text
AGENTS.md

docs/rules/
├── behavior.md
├── architecture.md
├── security.md
├── review.md
├── project-layout.md
└── git.md
```

- `behavior.md`：理解、修改、Debug、重构、优化和完成标准；
- `architecture.md`：职责、依赖、接口、复杂度和高风险变化；
- `security.md`：Secret、输入、权限、日志、数据和外部系统；
- `review.md`：提交前的范围、正确性、安全和验证检查；
- `project-layout.md`：PROJECT、需求三文件、罗网资产和旧文档整理；
- `git.md`：正式/开发分支、短期分支、Commit 和 PR 选择。

目标项目已有规则和技术栈约定不会被这些通用规则覆盖。

## 交给 AI 的安装提示词

复制下面整段内容给能够访问目标项目和本仓库的 AI：

```text
请把 https://github.com/cynos-ai/rules 当前默认分支中的通用规则安装到当前项目。

目标：
- 安装或更新 Cynos Rules 的 AGENTS.md 入口和 docs/rules/**；
- 保留当前项目已有的技术栈、命令、架构、安全和协作约定；
- 根据当前项目事实生成或更新 docs/PROJECT.md；
- 不安装 npm 包、CLI、SDK、Adapter 或运行时代码；
- 不创建没有真实内容的空目录和占位文件。

执行步骤：
1. 先阅读当前项目已有的项目规则、README、文档、代码结构、测试和 Git 分支，不要立即写文件。
2. 读取 Cynos Rules 的 AGENTS.md 与 docs/rules/**，只把它们视为待合并的通用基线。
3. 判断当前 AI 平台是否原生支持 AGENTS.md：
   - 支持时，合并到项目根 AGENTS.md，不能直接覆盖已有内容；
   - 不支持时，选择该平台原生的项目级规则入口，在其中保留项目规则并要求 AI 按任务读取 docs/rules/**；
   - 无法确认平台入口时，先说明判断和推荐方案并询问我。
4. 将 Cynos Rules 的 docs/rules/** 合并到当前项目：
   - 保留项目已有且更具体的规则；
   - 删除与项目无关的示例，不把通用规则改成特定技术栈；
   - 遇到实质冲突时逐项列出并询问我，不能静默覆盖。
5. 根据当前项目代码和文档生成或更新 docs/PROJECT.md。不要复制 Cynos Rules 仓库自己的 docs/PROJECT.md。
6. 检查项目是否已经明确正式分支、开发分支、短期分支和 Commit 规则：
   - 没有既有约定时，推荐 main 为正式分支、develop 为开发分支；
   - 短期分支使用 feat/*、fix/*、docs/*、refactor/*、test/*、chore/*；
   - Commit 使用对应的 feat:、fix:、docs:、refactor:、test:、chore: 类型；
   - 已有其他分支名称时保留名称，只记录职责映射，不自动改名。
7. 如果项目尚未记录 PR 规则，只问我一个问题：
   “短期分支合入开发分支，以及开发分支合入正式分支时，是否要求 Pull Request？”
   给出三个选项：全部使用 PR、只有发布使用 PR、不使用 PR。记录我的选择，不要替我决定。
8. 完成规则安装后，单独询问我是否按照 docs/rules/project-layout.md 整理旧文档。没有得到同意前，不移动、合并、归档或删除任何旧文件。
9. 如果我同意整理，先输出逐文件计划，给每个文件标记：移动、合并、归档、保留或不确定，并说明目标位置和理由。等我再次确认后再操作。
10. 整理时遵守：
    - 使用 git mv 或等价方式保留历史；
    - 能明确归入 docs/PROJECT.md、docs/changes/<change-id>/** 或罗网目录的内容再移动/合并；
    - 仍有效但不属于最小结构的 API、架构、部署、运维等文档保留原位；
    - 只有过时、被替代或我明确要求保留为历史的内容进入 docs/archive/；
    - 不确定时询问，不能删除内容或用模板覆盖已有事实。
11. 修改完成后执行当前项目适用的检查，并报告：
    - 使用了哪个平台规则入口；
    - 新增、合并和保留了哪些规则；
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
├── changes/<change-id>/
│   ├── intent.md
│   ├── spec.md
│   └── plan.md
├── scenario-testing/       # 仅接入罗网时出现
└── archive/                # 仅有真实归档内容时出现
```

详细规则见 [`docs/rules/project-layout.md`](docs/rules/project-layout.md) 和 [`docs/rules/git.md`](docs/rules/git.md)。

## 设计边界

- Rules 是指导，不是安全 Sandbox 或强制 Policy；
- 不自动发现或修改用户项目；
- 不保证所有 AI 平台使用相同规则入口；
- 不提供技术栈模板；
- 不维护 Runtime 注入、Manifest、Benchmark 或模型 Profile；
- 不要求用户持续同步上游版本，更新时仍由 AI 比较并合并。

## 历史

本仓库曾探索 npm 包、Pi Adapter 和评测体系，但从未发布正式版本。旧方案保留在 Git tag [`archive/evidence-rules-v0`](https://github.com/cynos-ai/rules/tree/archive/evidence-rules-v0)，不再维护。

## License

[MIT](LICENSE)
