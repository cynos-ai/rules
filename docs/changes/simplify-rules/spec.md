# Cynos Rules 轻量化规格

## 1. 产品形态

仓库的对外交付物只有：

- 根目录 `AGENTS.md`；
- `docs/rules/**` 下的通用规则；
- README 中可直接复制给 AI 的安装提示词；
- MIT License。

`docs/PROJECT.md` 和 `docs/changes/**` 用于维护 Rules 项目自身，不属于复制到目标项目的规则包。

仓库不得包含 npm 包、运行时代码、编译产物、SDK、CLI、宿主 Adapter、Harness Adapter、Manifest、Benchmark 数据或评测集成。

## 2. 规则内容

固定规则文件为：

```text
docs/rules/
├── behavior.md
├── architecture.md
├── security.md
├── review.md
├── project-layout.md
└── git.md
```

内容来源顺序：

1. 提取 `~/文档/java-taro-rules/` 中技术栈无关且仍适用的内容；
2. 删除 Java、Spring、Taro、Maven、MyBatis、Flyway 和固定 API/数据库实现；
3. 合并重复规则，改成直接、可执行的表达；
4. 从 Cynos 默认项目文件架构约定提取项目文件规范；
5. 不从旧 Cynos Rules 的注入、digest、Harbor 或 Benchmark 设计中提炼 Runtime Rules。

`AGENTS.md` 只保存每次任务都适用的底线、按任务读取规则的入口和项目自身已确认的 Git 协作方式，不复制全部规则正文。

## 3. 安装行为

README 必须提供一段完整提示词，要求目标 AI：

1. 先读取目标项目现有规则、代码和文档；
2. 从当前仓库读取 `AGENTS.md` 和 `docs/rules/**`；
3. 支持 `AGENTS.md` 时合并内容，不覆盖项目已有技术栈、命令或安全约束；
4. 不支持 `AGENTS.md` 时选择平台原生项目规则入口，并从该入口引用 `docs/rules/**`；
5. 冲突规则无法安全合并时先询问用户；
6. 根据目标项目事实生成或更新 `docs/PROJECT.md`，不得复制 Rules 项目的 `docs/PROJECT.md`；
7. 不创建没有实际内容的目录和文件；
8. 在移动旧文件前单独询问用户是否采用目录整理；
9. 用户同意后先提供逐文件移动/合并/归档/保留计划，得到确认后再操作；
10. 使用 `git mv` 保留可追踪历史，不删除内容；
11. 只把过时或已被替代的文档放入 `docs/archive/`；仍有效但无法归类的文档保留原位；
12. 完成后报告所有新增、合并、移动、归档、保留和未解决冲突。

## 4. 项目文件规范

默认长期项目文件为：

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
├── changes/<change-id>/
│   ├── intent.md
│   ├── spec.md
│   └── plan.md
├── scenario-testing/          # 仅接入罗网时出现
│   ├── scenarios/
│   └── reports/
└── archive/                   # 仅存在真实归档内容时出现
```

规则不规定源码、构建、部署和单元测试目录，不要求目录 README 或手工索引。

## 5. Git 规范

项目必须明确：

- 一个正式分支，默认 `main`；
- 一个开发集成分支，默认 `develop`；
- 日常工作从开发分支创建 `feat/*`、`fix/*`、`docs/*`、`refactor/*`、`test/*` 或 `chore/*` 短期分支；
- 发布时由开发分支合入正式分支；
- 正式和开发分支不 force-push；
- Commit 使用对应的 `feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:` 类型，并保持原子；
- 项目已有其他分支名称时不自动重命名，而是记录职责映射；
- 是否使用 PR、哪些合并要求 PR、采用何种 merge 策略由用户决定并写入项目规则。

## 6. 旧项目替换

- 当前旧设计提交使用 Git tag `archive/evidence-rules-v0` 保留；
- 当前主线删除旧 Runtime、Adapter、评测、双语同步和 npm 发布材料；
- GitHub 仓库继续使用 `cynos-ai/rules`，不创建第二个同类项目；
- 不执行 npm deprecate，因为包从未发布；
- GitHub 描述更新为轻量项目规则定位。

## 7. 验收条件

- **AC-CONTENT-01**：六个规则文件存在，内容技术栈无关且没有旧注入/评测术语；
- **AC-ENTRY-01**：`AGENTS.md` 简短并能把 AI 路由到相关规则；
- **AC-INSTALL-01**：README 提示词覆盖合并、平台适配、PROJECT 生成和无覆盖原则；
- **AC-MIGRATE-01**：README 提示词要求用户确认、逐文件计划、仅归档过时文件且不删除内容；
- **AC-LAYOUT-01**：项目目录规则覆盖 PROJECT、change 三文件、可选罗网资产和按需归档；
- **AC-GIT-01**：Git 规则覆盖正式/开发分支、短期分支、Commit 类型和用户决定 PR；
- **AC-SCOPE-01**：仓库不再包含 npm、Adapter、Runtime、Manifest、Harbor 或 Benchmark 资产；
- **AC-HISTORY-01**：旧提交可通过 `archive/evidence-rules-v0` 找回；
- **AC-READER-01**：无对话上下文的 AI 能根据 README 正确说明安装和旧文档整理步骤。
