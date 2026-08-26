<!-- source-sha256:ab70fda026c1b8c2a349aedd50617ba988943a20c06f19e35b7ebea766cf3432 -->
# 评测指南

状态：**集成骨架；尚未声明任何付费 Benchmark 结果**

[权威设计](../../DESIGN.zh-CN.md)定义实验。本指南说明仓库如何把执行委托给 Harbor，而不是实现评测平台。

## 职责

- Harbor 解析 SWE-bench Verified 任务、创建容器、运行 Trial、记录 Trajectory 并执行开发阶段评分。
- `integrations/harbor` 提供一个轻量 Installed Agent 子类，用于固定并隔离 Pi，并可选加载 Cynos Rules CLI Adapter。
- 上游 SWE-bench Evaluator 仍然是 Dev-30 和 Confirm-100 Patch 的发布权威。
- GitHub Issues 和 Pull Requests 保留 Finding 和规则决策。

## 前置条件

- 适合运行 Harbor Task 的 Docker；
- 满足根包要求的 Node.js；
- `uv`；
- 通过 `DEEPSEEK_API_KEY` 提供的 DeepSeek 官方 API Key；
- 批准的 Campaign 上限内足够的 Provider 余额。

首先安装并构建仓库：

```bash
npm ci --ignore-scripts
npm run check
npm run build

cd integrations/harbor
uv sync --frozen
```

Harbor 固定为 `0.22.0`；Pi 固定为 `0.84.3`。

## 隔离 Profile

`CynosRulesPi` 始终使用以下参数运行 Pi：

```text
--no-approve
--no-extensions
--no-skills
--no-prompt-templates
--no-context-files
```

它还使用一个空的容器本地 `PI_CODING_AGENT_DIR`。启用 Rules 的条件只显式加载 `dist/pi/cli.js`。Baseline 和 Candidate 运行以只读方式挂载相同仓库 bytes，使 Rule Adapter 成为唯一预期变量。

## 挂载

不要直接挂载 Checkout：仅供 Operator 使用的 `.env` 绝不能暴露给 Agent Container。应先创建干净的只读 Staging 副本：

```bash
export RULES_ROOT="$(git rev-parse --show-toplevel)"
export EVAL_MOUNT="$(mktemp -d /tmp/cynos-rules-eval-mount.XXXXXX)"
rsync -a --delete \
  --exclude='.env' --exclude='.env.*' --exclude='.git/' \
  --exclude='node_modules/' --exclude='integrations/harbor/.venv/' \
  --exclude='integrations/harbor/results/' \
  "$RULES_ROOT/" "$EVAL_MOUNT/"
test ! -e "$EVAL_MOUNT/.env"
MOUNTS="$(python -c 'import json, os; print(json.dumps([{\"type\":\"bind\",\"source\":os.environ[\"EVAL_MOUNT\"],\"target\":\"/opt/cynos-rules\",\"read_only\":True}]))')"
export MOUNTS
```

不要挂载 `~/.pi`、维护者 Home 目录、包含凭据的 Checkout 或本仓库的可写副本。

## 单题兼容性运行

执行任何 Campaign 前，选择一个预注册 Pilot Task，并且只运行一次 Attempt。

Baseline：

```bash
uv run harbor run \
  -d swebench-verified@1.0 \
  -i '<task-name>' \
  -a cynos_rules_harbor.agent:CynosRulesPi \
  -m deepseek/deepseek-v4-flash \
  --ak version=0.84.3 \
  --ak thinking=low \
  --ak rules_enabled=false \
  --env-file "$RULES_ROOT/.env" \
  --mounts "$MOUNTS" \
  -k 1 -n 1 -y \
  --jobs-dir results/pilot-baseline
```

启用 Rules 的运行使用相同命令，只改变：

```text
--ak rules_enabled=true
```

启用 Rules 的运行需要有效的已接受或候选 `rules/manifest.json`、精确规则文件和已经构建的 `dist/` 目录。尚未发布的空骨架刻意不包含 Runtime Manifest，不能伪装成已经验证的 Ruleset。

## 正式配对

对于正式任务配对：

- 使用相同 Task Name；
- 使用相同模型、Pi、Thinking Level、工具、超时、环境和 Evaluator；
- 设置 `-k 1`；
- 保留两个 Harbor Job 目录；
- 绝不在重试或 Patch 中挑选；
- 把推理前基础设施失败与 Agent 失败分开分类。

冻结的 v0 Task List 已提交在 [`evaluation/task-sets/v0/`](../../evaluation/task-sets/v0/)。Harbor Registry Name 是 `swebench-verified@1.0`；其源 Dataset Commit 和 Task-ID Digest 记录在 `evaluation/task-sets/v0/manifest.json` 中。不要临时选择任务，也不要使用其他 Harbor Dataset Version。

## 无人值守执行

Harbor Job 不需要逐题人工输入。可以在可信的长期 Shell、CI `workflow_dispatch` 或可信 Worker 中运行。启动前，维护者批准 Campaign、模型凭据、Task List、并发和预算。

v0 集成在每个 Trial 的 Agent Log 中记录 Pi JSON Event、Token Usage、报告费用，以及包含 `rulesEnabled` 实验 Arm 和挂载 Rules Manifest 的 `cynos-rules-profile.json` 文件。可以使用 Harbor Viewer 检查已经完成的 Job：

```bash
uv run harbor view results
```

当前轻量集成不会用自研调度器或数据库替代 Harbor。

## 费用和停止 Policy

使用 `DESIGN.md` 中的 Campaign 上限。开始付费工作前，Campaign Manifest 必须记录 Provider 价格快照和保守的 In-flight Reserve。如果可用的 Harbor 执行模式无法强制批准的上限和完成 Policy，就不要启动付费 Campaign；应先增加或选择经过 Review 的轻量编排机制，同时不改变产品边界。

## 证据

对于发布证据：

1. 保留 Harbor `config.json`、`result.json`、Trial Result、Pi Log、Patch Artifact 和 Manifest 身份；
2. 使用官方 SWE-bench Evaluator 重新评测每个 Dev-30 和 Confirm-100 Patch；
3. 创建一个 Campaign 级 Evaluation Finding Issue；
4. 原始 GitHub Actions Artifacts 保留 30 天；
5. 将紧凑的规范化证据包附加到 Release，并记录其 SHA-256 digest。

绝不向 Agent 暴露模型凭据、Gold Patch、隐藏测试或 Verifier 内部实现。
