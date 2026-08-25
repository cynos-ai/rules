<!-- source-sha256:7aba61d7ebc975b1b68fd5cfbdc5be8ec0036a2b71708ef61cc1f2f7f8fb1e61 -->
# 安全 Policy

## 支持的版本

Cynos Rules 尚未发布受支持的 Runtime 版本。从 `0.1.0` 开始，本节将列出受支持版本。

## 报告漏洞

不要为疑似漏洞创建公开 Issue。请使用仓库的私有 GitHub Security Advisory 表单：

```text
https://github.com/cynos-ai/rules/security/advisories/new
```

请包含受影响 Commit 或版本、影响、复现步骤和可能的缓解方案。不要包含真实模型凭据、私有仓库内容、隐藏 Benchmark 测试或无关个人数据。

## 范围

相关报告包括：

- 暴露凭据或可变宿主资源的包或 Adapter 行为；
- Ruleset 身份、digest、重复或冲突检测失效；
- 隔离 Profile 意外加载 Skills、Extensions、Prompts 或 Context；
- 向 Agent 泄露 Benchmark 答案；
- 不安全的 Harbor Mount 或 Artifact 脱敏行为。

Prompt Guidance 无法可靠控制模型行为本身不构成安全漏洞。Cynos Rules 不声称 Prompt 文本能够强制权限或 Sandbox 边界。
