# Cynos Rules 轻量化实施计划

## 1. 建立变更基线

1. 在旧设计最后一个提交创建 `archive/evidence-rules-v0` tag 并推送；
2. 创建长期 `develop` 分支；
3. 从 `develop` 创建本次短期分支；
4. 写入 `docs/PROJECT.md` 和本需求的 intent/spec/plan。

验收：历史 tag、正式分支、开发分支和需求工件均可在 Git 中定位。

## 2. 建立规则正文

1. 从 `java-taro-rules` 的 `AGENTS.md`、`behavior.md`、`architecture.md`、`conventions.md`、`review.md` 和 `philosophy.md` 提取通用内容；
2. 删除技术栈、固定框架、固定目录、固定命令和固定 API/数据库实现；
3. 写入 behavior、architecture、security、review；
4. 从 Cynos 默认项目文件架构约定写入 project-layout；
5. 写入正式/开发分支、短期分支、Commit 和 PR 选择规则；
6. 建立简短的根 `AGENTS.md`。

验收：`AC-CONTENT-01`、`AC-ENTRY-01`、`AC-LAYOUT-01`、`AC-GIT-01` 通过。

## 3. 建立安装入口

1. 重写 README，说明产品定位、规则文件和明确非目标；
2. 提供可直接复制给目标 AI 的完整提示词；
3. 提示词要求先检查平台和已有规则，合并而非覆盖；
4. 提示词要求单独询问旧文档整理，并在操作前给出逐文件计划；
5. 提示词明确有效但无法归类的文件保留，只有过时内容归档。

验收：`AC-INSTALL-01`、`AC-MIGRATE-01` 通过。

## 4. 删除旧产品实现

删除 npm、TypeScript、Pi Adapter、Manifest、测试、Harbor、Benchmark、旧设计、双语同步、旧 Issue/PR 模板和 CI。保留 MIT License、Git 历史以及本次新文档。

更新 GitHub 仓库描述，不发布 npm 包或 Release。

验收：`AC-SCOPE-01`、`AC-HISTORY-01` 通过。

## 5. 验证与合入

1. 检查仓库只剩预期文件；
2. 搜索 Java/Taro/Pi/Harbor/npm/manifest/benchmark 等残留产品内容；
3. 检查 Markdown 内部链接和目录示例；
4. 使用无历史上下文的 AI 阅读 README 和规则，回答安装、迁移、Git 和平台兼容问题；
5. 修复歧义后提交；
6. 提交完成后由项目负责人决定本次通过 PR 还是直接 merge 合入 `develop`，再由 `develop` 发布到 `main`；在确认前不自行合并。

验收：全部 AC 通过，提交分支工作区干净；合入后远程分支和 GitHub 描述符合新定位。
