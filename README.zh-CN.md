<!-- source-sha256:3cdf7c5e869646c8d2fc1be054041430a82c2129f541e57354d5ef825dcd7d81 -->
# Cynos Rules

为编程 Agent 提供经过证据检验的判断规则。

> **教授判断，而不是操作步骤。检验每一条规则。**

Cynos Rules 当前处于设计优先、尚未发布的阶段。只有至少一条候选规则通过已记录的证据 Gate 后，才会发布 `0.1.0`。

## 当前范围

- 一套小型、固定的 `core` Ruleset；
- 通过 SDK 和 CLI Adapter 确定性注入 Pi；
- 用于配对评测 Vanilla Pi 与 Pi + Cynos Rules 的轻量 Harbor 集成；
- 使用 GitHub Issues 和 Pull Requests 提议与评审规则变更。

Cynos Rules 不管理 `AGENTS.md`，不交付 Skills，不实现评测平台，也不声称 Prompt Enforcement。

## 权威文档

实现或评审变更前，请阅读 [v0 权威设计](DESIGN.md)。项目提供[中文翻译](DESIGN.zh-CN.md)方便读者阅读；英文文档是权威版本。

- [规则哲学](docs/zh-CN/philosophy.md)
- [评测指南](docs/zh-CN/evaluation.md)
- [贡献指南](CONTRIBUTING.zh-CN.md)
- [安全 Policy](SECURITY.zh-CN.md)
- [行为准则](CODE_OF_CONDUCT.zh-CN.md)
- [Pi 0.84.3 兼容性证据](docs/zh-CN/compatibility/pi-0.84.3.md)

## 状态

Rules Contract、Pi Adapter、Pi 0.84.3 离线回归测试和 Harbor 集成骨架已经实现。目前没有 Runtime Rule 被接受，也没有声明任何付费 Benchmark 结果。只有首条规则被接受并发布 `0.1.0` 后，才会添加安装说明。

## 许可证

[MIT](LICENSE)
