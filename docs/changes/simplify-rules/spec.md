# Cynos Rules 轻量化规格

## 1. 产品形态

仓库的对外交付物只有：

- 根目录 `AGENTS.md`；
- `docs/rules/**` 下的通用规则和 `VERSION`；
- README 中可直接复制给 AI 的安装/更新提示词；
- 根目录 `CHANGELOG.md`；
- MIT License。

`docs/PROJECT.md` 和 `docs/changes/**` 用于维护 Rules 项目自身，不属于复制到目标项目的规则包。

仓库不得包含 npm 包、运行时代码、编译产物、SDK、CLI、宿主 Adapter、Harness Adapter、Manifest、Benchmark 数据或评测集成。

## 2. 规则内容

固定规则文件为：

```text
docs/rules/
├── VERSION
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

`AGENTS.md` 只保存每次任务都适用的底线和按任务读取规则的入口，不复制全部规则正文。目标项目已确认的 Git 协作方式记录在其平台规则入口或 `docs/PROJECT.md`；本仓库的 `AGENTS.md` 同时作为可复制基线，因此本仓库自己的 PR 决定记录在 `docs/PROJECT.md`，避免被目标项目误用。

## 3. 版本机制

- 当前通用规则首个正式版本为 `1.0.0`；
- `docs/rules/VERSION` 只保存一个 SemVer 版本号，随规则一起复制到目标项目；
- 根目录 `CHANGELOG.md` 记录每个版本的用户可观察变化和迁移说明；
- 每个发布版本在 `main` 对应一个 `v<version>` Git tag；
- 主版本表示规则职责或文件合同出现不兼容变化，次版本表示向后兼容地新增规则，修订版本表示不改变规则意图的修正和澄清；
- 目标项目没有 `VERSION`、但存在 `java-taro-rules` 式 AGENTS、behavior、architecture、conventions、frontend/backend 等规则时，安装 AI 将其视为 v0 迁移基线；v0 是迁移标签，不要求存在旧 Git tag；
- 从 v0 升级时提取通用规则，但保留仍有效的 Java、Taro、部署、命令和项目协作约定；这些项目特有内容不得因升级到通用 Rules 而丢失；
- 从正式版本更新时，AI 读取目标版本、上游对应 tag、当前版本和 Changelog，比较上游版本差异后合并本地规则；不能整目录覆盖；
- 只有规则和冲突处理成功后才更新目标项目的 `VERSION`；版本相同不代表可以覆盖本地修改；不自动降级。

## 4. 安装与更新行为

README 必须提供一段完整提示词，要求目标 AI：

1. 先读取目标项目现有规则、代码和文档；
2. 从当前仓库读取 `AGENTS.md`、`docs/rules/**`、`CHANGELOG.md` 和 Git tags；
3. 读取目标项目 `docs/rules/VERSION`；缺失时识别 v0 迁移基线或普通未版本化规则，不能仅凭缺失就覆盖；
4. 支持 `AGENTS.md` 时合并内容，不覆盖项目已有技术栈、命令或安全约束；
5. 不支持 `AGENTS.md` 时选择平台原生项目规则入口，并从该入口引用 `docs/rules/**`；
6. 比较目标已安装版本与上游版本；v0 升级时特别保留技术栈规则，正式版本更新时按对应 tag 做三方差异判断；
7. 冲突规则无法安全合并时先询问用户；
8. 根据目标项目事实生成或更新 `docs/PROJECT.md`，不得复制 Rules 项目的 `docs/PROJECT.md`；
9. 不创建没有实际内容的目录和文件；
10. 在移动旧文件前单独询问用户是否采用目录整理；
11. 用户同意后先提供逐文件移动/合并/归档/保留计划，得到确认后再操作；
12. 使用 `git mv` 保留可追踪历史，不删除内容；
13. 只把过时或已被替代的文档放入 `docs/archive/`；仍有效但无法归类的文档保留原位；
14. 全部规则成功合并后写入新的 `VERSION`；
15. 完成后报告原版本、新版本以及所有新增、合并、移动、归档、保留和未解决冲突。

## 5. 项目文件规范

默认长期项目文件为：

```text
<platform-rule-entry>
docs/
├── PROJECT.md
├── rules/
│   └── VERSION
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

## 6. Git 规范

项目必须明确：

- 一个正式分支，默认 `main`；
- 一个开发集成分支，默认 `develop`；
- 日常工作从开发分支创建 `feat/*`、`fix/*`、`docs/*`、`refactor/*`、`test/*` 或 `chore/*` 短期分支；
- 发布时由开发分支合入正式分支；
- 正式和开发分支不 force-push；
- Commit 使用对应的 `feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:` 类型，并保持原子；
- 项目已有其他分支名称时不自动重命名，而是记录职责映射；
- 是否使用 PR、哪些合并要求 PR、采用何种 merge 策略由用户决定并写入项目规则。

## 7. 旧项目替换

- 当前旧设计提交使用 Git tag `archive/evidence-rules-v0` 保留；
- 当前主线删除旧 Runtime、Adapter、评测、双语同步和 npm 发布材料；
- GitHub 仓库继续使用 `cynos-ai/rules`，不创建第二个同类项目；
- 不执行 npm deprecate，因为包从未发布；
- GitHub 描述更新为轻量项目规则定位。

## 8. 验收条件

- **AC-CONTENT-01**：六个规则文件存在，内容技术栈无关且没有旧注入/评测术语；
- **AC-VERSION-01**：`VERSION` 为有效 SemVer，Changelog 和发布 tag 规则明确，新版本只在完整合并后写入目标项目；
- **AC-V0-01**：没有 VERSION 的 `java-taro-rules` 类项目可识别为 v0，升级时保留仍有效的技术栈规则；
- **AC-ENTRY-01**：`AGENTS.md` 简短并能把 AI 路由到相关规则；
- **AC-INSTALL-01**：README 提示词覆盖合并、平台适配、PROJECT 生成和无覆盖原则；
- **AC-MIGRATE-01**：README 提示词要求用户确认、逐文件计划、仅归档过时文件且不删除内容；
- **AC-LAYOUT-01**：项目目录规则覆盖 PROJECT、change 三文件、可选罗网资产和按需归档；
- **AC-GIT-01**：Git 规则覆盖正式/开发分支、短期分支、Commit 类型和用户决定 PR；
- **AC-SCOPE-01**：仓库不再包含 npm、Adapter、Runtime、Manifest、Harbor 或 Benchmark 资产；
- **AC-HISTORY-01**：旧提交可通过 `archive/evidence-rules-v0` 找回；
- **AC-READER-01**：无对话上下文的 AI 能根据 README 正确说明安装和旧文档整理步骤。
