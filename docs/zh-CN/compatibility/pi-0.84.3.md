<!-- source-sha256:01e54de71a0e9dcaa3566ed28fcd21a44ef9efd720f65fac2e8b256eab2e309f -->
# Pi 0.84.3 兼容性 Spike

- 状态：**PASS**
- Runtime：`@earendil-works/pi-coding-agent@0.84.3`
- Node.js：`v24.14.1`

本 Spike 验证 [v0 权威设计](../../../DESIGN.zh-CN.md)要求的 Pi API。它不验证任何候选 Runtime Rule。

## SDK 路径

使用以下配置创建 `DefaultResourceLoader`：

- `appendSystemPromptOverride` 添加一个固定 Marker 和正文；
- 禁用 Extensions、Skills、Prompt Templates、Themes 和 Context Files；
- 使用隔离的 Pi Agent 目录；
- 使用内存 Settings 和 Session 状态。

执行 `reload()` 和 `createAgentSession()` 后：

- 有效的 `session.agent.state.systemPrompt` 恰好包含一个 Marker；
- 加载了零个 Skills；
- 加载了零个 Context Files；
- 加载了零个 Extensions。

结果：**PASS**。

## CLI 路径

在 Pi Print Mode 中显式加载两个临时 Extension：

1. 第一个通过 `before_agent_start` 注入固定 Marker；
2. 第二个检查 `event.systemPrompt` 和 `ctx.getSystemPrompt()`。

在同一进程中的两个 Prompt 中：

- 每次 Handler 都恰好观察到一个 Marker；
- `event.systemPrompt` 等于 `ctx.getSystemPrompt()`；
- Marker 数量没有跨 Turn 累积；
- Pi 无需交互即可完成。

结果：**PASS**。

## 自动化离线回归

测试套件启动隔离的 OpenAI 兼容 Loopback Server，并在不使用模型凭据的情况下运行 Pi 0.84.3。

它验证：

- 以 Cynos Extension 作为唯一注入路径的 SDK Session 向 Provider 发送恰好一个 Marker 和精确规则正文；
- 组合使用 SDK `appendSystemPromptOverride` 和 Effective Prompt Guard 时，也只发送一个规则块；
- 当 `--no-extensions` 禁用发现时，Pi CLI 仍然加载显式 `--extension`；
- CLI Provider Request 包含 Extension 添加的 Prompt Marker；
- stdin 已关闭，并且运行无需交互即可完成。

这些检查通过 `npm test` 运行，不使用付费模型。

## 源码级确认

Pi 0.84.3 提供：

- `DefaultResourceLoaderOptions.appendSystemPromptOverride`；
- 链式 `before_agent_start` System Prompt；
- 能够反映链中先前 Handler 结果的 `ctx.getSystemPrompt()`。

Pi 每个 Turn 都从 `_baseSystemPrompt` 重新构建，因此在正常运行中，按 Turn 执行的 CLI Extension 不会累积前一 Turn 的文本。

## 决策

Cynos Rules v0 固定 `@earendil-works/pi-coding-agent@0.84.3`。生产测试必须复现这些断言。任何 Pi 升级都需要重新执行兼容性测试，并经过 Review 更新权威设计。
