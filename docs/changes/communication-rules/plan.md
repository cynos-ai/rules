# 通用沟通与简洁表达规则实施计划

## 1. 建立变更基线

1. 从 `develop` 创建 `feat/communication-rules`；
2. 写入本需求的 intent、spec、plan；
3. 确认 Guidance v0.1、Guidance v0.2、现有 Rules 和 Caveman 参考之间的职责边界。

## 2. 写入沟通规则

1. 新增 `docs/rules/communication.md`；
2. 把适用范围扩展到大部分面向用户的自然语言回复；
3. 提炼 Guidance v0.1 的结果优先、由外到内和按场景报告结构；
4. 提炼 Caveman 的去填充、精确信息保护和清晰度回退原则；
5. 排除品牌语气、破碎语法、强度模式和对话工作流。

验收：`AC-SCOPE-01`、`AC-DIRECT-01`、`AC-STRUCTURE-01`、`AC-CLARITY-01`、`AC-NONMODE-01` 通过。

## 3. 接入并发布版本

1. 更新 `AGENTS.md`，让用户沟通默认读取 communication，并加入最短常驻底线；
2. 更新 README、`docs/PROJECT.md` 和 `project-layout.md`；
3. 将 VERSION 更新为 `1.1.0`；
4. 在 Changelog 增加 `1.1.0`；
5. 检查链接、版本、文件清单和 diff；
6. 使用无上下文 AI 检查简单回答、技术解释、失败说明、高风险警告和正式文档边界；
7. 短期分支直接 merge 到 `develop`，再通过 `develop → main` PR 发布；
8. 发布后创建 `v1.1.0` tag，并同步 `develop`。

验收：`AC-ENTRY-01`、`AC-VERSION-01`、`AC-READER-01` 通过，工作区干净。
