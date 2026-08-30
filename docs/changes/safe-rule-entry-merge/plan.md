# 安全合并项目规则入口实施计划

## 1. 建立变更基线

1. 从 `develop` 创建 `feat/safe-rule-entry-merge`；
2. 写入 intent、spec、plan；
3. 明确平台入口、托管区块、项目内容和 docs/rules 的不同所有权边界。

## 2. 建立托管区块

1. 在根 `AGENTS.md` 中用唯一 begin/end 标记包住可安装内容；
2. 保留 Rules 仓库自身说明在区块之外；
3. 标记版本设为 `1.2.0`；
4. 在项目文件规范中说明区块外项目内容不可改写。

验收：`AC-MARKER-01`、`AC-INSTALL-01`、`AC-PLATFORM-01` 通过。

## 3. 修订安装与更新行为

1. README 提示词先识别实际平台入口；
2. 首次安装只插入托管区块；
3. 有标记更新比较旧上游、新上游和本地内容；
4. 无标记旧 Cynos 版本只替换可精确匹配内容；
5. v0 和未知内容默认保留；
6. 损坏、重复、版本冲突或所有权不明时停止并询问；
7. docs/rules 保持既有三方合并，不删除额外文件。

验收：`AC-UPDATE-01`、`AC-LEGACY-01`、`AC-FAILSAFE-01`、`AC-FILES-01` 通过。

## 4. 发布与验证

1. 更新 `docs/PROJECT.md`、README、project-layout 和 Changelog；
2. 将 VERSION 更新为 `1.2.0`；
3. 用本地 fixture 覆盖：首次 AGENTS、首次 CLAUDE、未修改旧区块、本地修改区块、无标记 1.1.0、损坏或重复标记；
4. 检查 Markdown 链接、标记唯一性、版本一致性和 diff；
5. 使用无上下文 AI 复核五种升级决策；
6. 短期分支直接 merge 到 `develop`，再通过 `develop → main` PR 发布；
7. 发布后创建 `v1.2.0` tag，并同步 `develop`。

验收：`AC-VERSION-01`、`AC-READER-01` 通过，工作区干净。
