<!-- source-sha256:f4984994b136d05b49c6c490f3669aec242e942f8c873340d5771c838ec3362e -->
# 为 Cynos Rules 贡献

感谢你帮助 Cynos Rules 保持小型、可检验且有用。

提出变更前，请阅读[权威设计](DESIGN.zh-CN.md)和[规则哲学](docs/zh-CN/philosophy.md)。该设计是 v0 的规范性文档。

## 本地检查

要求：

- Node.js `24.14.1`，或满足 `>=22.19.0` 的兼容 Node 版本；
- npm；
- 离线检查不需要模型凭据。

```bash
npm ci --ignore-scripts
npm run check
npm run build
```

仓库为 v0 兼容性测试固定 `@earendil-works/pi-coding-agent@0.84.3`。

## 规则变更

提交规则 Pull Request 前，先创建 **Rule Proposal** Issue。提案必须从真实或可复现失败开始，并且通常只覆盖一个 Rule ID。

规则 Pull Request 必须包含：

- 精确英文 Runtime 文本；
- 正向、近邻、冲突和过度遵循 Fixtures；
- Manifest、digest 和 Token Count 更新；
- 预注册评测证据；
- 已知回归和限制；
- 关联 Proposal Issue。

未经验证的规则不会进入 `rules/core/` 或默认 Manifest。自动化不会自行接受规则；维护者通过 Review 做出决定。

## 评测发现

使用 **Evaluation Finding** Issue Template 记录 Campaign 观察。Finding 是事实，不会自动成为 Rule Proposal。提出更多 Prompt 文本前，先对宿主、模型、基础设施、Benchmark 和确定性工具缺陷进行分类。

付费 Benchmark Job 只有在维护者明确批准后，才能从经过 Review 的 Commit 在可信 Runner 上运行。绝不向不可信 Pull Request 代码暴露模型凭据。

## 文档

英文是权威版本。每篇实质性英文文档都需要逐篇对应的中文翻译：

- 根目录 `NAME.md` → `NAME.zh-CN.md`；
- `docs/path/NAME.md` → `docs/zh-CN/path/NAME.md`。

每篇中文文档的第一行记录其英文源文件的 SHA-256 digest：

```text
<!-- source-sha256:<64 lowercase hex characters> -->
```

更新英文源文件及其翻译后，请更新该 Marker，并运行 `npm run check:docs`。

## Pull Requests

保持变更范围窄小。不要组合独立规则、Adapter 重设计、Benchmark 变更和无关清理。如果变更修改了规范性产品边界，应先通过明确 Review 更新 `DESIGN.md` 及其翻译，再依赖新行为。
