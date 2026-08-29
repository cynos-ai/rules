# Changelog

Cynos Rules 整套通用规则共用一个 SemVer 版本。目标项目把已完整合并的版本记录在 `docs/rules/VERSION`，本仓库在 `main` 为每个正式版本创建 `v<version>` tag。

## 1.0.0

首个正式的轻量规则版本：

- 提供简短 `AGENTS.md` 入口；
- 提供开发行为、架构、安全、评审、项目文件和 Git 六组通用规则；
- 约定 `docs/PROJECT.md`、需求 `intent/spec/plan` 和可选罗网场景测试目录；
- 约定正式分支、开发分支、短期分支和 Commit 类型，PR 策略由用户决定；
- README 提供由 AI 执行的安装、更新和旧文档整理提示词；
- 不再提供 npm、Pi Adapter、Harness Adapter、Runtime 注入、Manifest 或评测体系。

### 从 v0 迁移

v0 是对未带 `docs/rules/VERSION` 的旧 `java-taro-rules` 类项目规则的兼容称呼，不是本仓库的正式 Release。

迁移到 1.0.0 时：

- 将可以通用化的行为、架构、安全和评审规则与 1.0.0 合并；
- 保留仍有效的 Java、Taro、前后端、数据库、部署、命令、模板和协作约定；
- 保留目标项目已有的额外规则文件；
- 冲突由 AI 列出并交给用户决定，不能整目录覆盖；
- 全部合并成功后才写入 `docs/rules/VERSION = 1.0.0`。

## 版本规则

- **Major**：改变规则职责、文件合同或需要人工迁移；
- **Minor**：向后兼容地增加规则或安装能力；
- **Patch**：不改变规则意图的修正、去重和澄清。

更新 AI 应比较目标版本对应 tag 与目标版本之间的上游差异，再合并目标项目本地修改。不得只根据版本号覆盖文件，也不得自动降级。
