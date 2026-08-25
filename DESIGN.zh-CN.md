<!-- source-sha256:44bac9d054125c63cad9be77e5e819eca2ed602c4b93fda07519b42d5183bbc2 -->
# Cynos Rules v0——权威设计

- 状态：**已批准实施**
- 权威性：**v0 规范性文档**
- 产品：**Cynos Rules**
- 仓库：**`cynos-ai/rules`**
- npm 包：**`@cynos-ai/rules`**
- 许可证：**MIT**

本文档是 Cynos Rules v0 的权威设计。实现、测试、文档、贡献流程和发布决策都必须遵守本文档。如果其他文档与本文档冲突，在经过评审的变更更新本文档之前，以本文档为准。

英文原文为 `DESIGN.md`。英文文档是权威版本。翻译差异不会改变设计。

## 1. 使命

Cynos Rules 为编程 Agent 提供一组非常小、经过证据检验的判断规则。

> **教授判断，而不是操作步骤。检验每一条规则。**

规则是假设，不是戒律。每条规则都必须证明自己值得永久占用 System Prompt Token。

本产品刻意保持小型。维护它所需的大部分工作是验证，而不是增加规则数量。

## 2. 产品边界

Cynos Rules v0 只有两个产品职责：

1. 交付已接受的权威规则；
2. 将这些规则确定性地注入 Pi。

仓库还包含使用现有开源基础设施评测这两个职责所必需的最少集成和文档。

### 2.1 v0 包含的内容

- 一套权威英文 `core` Ruleset；
- 用于标识该 Ruleset 的 Manifest 和 digest；
- Pi SDK Adapter；
- Pi CLI Adapter；
- 用于评测启用和未启用规则的 Pi 的轻量 Harbor 集成；
- 内容、digest、注入和 Pi 兼容性的确定性测试；
- 规则提案使用的 GitHub Issue 和 Pull Request 模板；
- 本地和无人值守评测说明；
- 英文文档和逐篇对应的中文翻译。

### 2.2 v0 明确排除的内容

- 自研评测平台、调度器、数据库、仪表盘或 Web 服务；
- 独立品牌的规则实验室；
- 自研提案状态机或提案文件目录体系；
- Skills；
- Pi 之外其他宿主的 Adapter；
- 项目记忆管理；
- 创建、生成或修改用户的 `AGENTS.md`；
- Runtime Adapter 中的工具、MCP Server、网络访问、仓库修改或业务状态；
- Policy Enforcement，或声称 Prompt Guidance 是安全边界；
- 根据用户消息动态选择规则；
- 模块开关、单条规则开关、自定义规则路径或环境变量规则覆盖；
- Benchmark 特定答案、隐藏测试、Gold Patch 或任务专用提示。

只有在 v0 证据证明存在真实需要后，才可以重新考虑被排除的能力。它们不构成隐含路线图承诺。

## 3. 权威 Ruleset

### 3.1 一套固定 Ruleset

v0 只有一套名为 `core` 的 Ruleset。

注册 Adapter 会加载完整的 `core` Ruleset。不注册 Adapter 就得到 Vanilla Pi。Adapter 内部没有 Runtime 启停开关，也不支持局部组合。

被接受的规则应当共同有效。如果某条规则不能证明值得默认启用，它就不属于 v0。

### 3.2 规模预算

包含身份 Marker 在内的完整注入块，在使用 `o200k_base` tokenizer 测量时不得超过 400 个 Token。这是可复现的 v0 准入指标，不代表所有 Provider 都使用相同 tokenizer。Manifest 和 Release Report 必须记录测得的数量。

初始批次最多包含三个 Proposed Rule ID，每个对应第 4 节中的一个方向。首个版本可以包含这三条中的任意正数子集。不得为了达到目标数量而降低证据 Gate。如果没有候选规则通过，就不发布 Runtime 包。

### 3.3 语言

权威 Runtime Rules 只使用英文。无论用户使用什么语言，Pi 都接收相同的英文 bytes。

中文翻译是面向读者的文档。它不是第二套 Runtime Ruleset，不参与 Runtime digest，也不得替代权威文本进行注入。

### 3.4 稳定身份

每条已接受规则都有稳定的 Rule ID。一个 Proposal Issue 及其 Pull Request 通常只新增、修改或删除一个 Rule ID。不得在一个 Pull Request 中捆绑相互独立的规则。如果一个语义单元确实无法合理拆分，可以作为例外，但 Pull Request 必须解释原因。

### 3.5 必需的规则形式

Runtime Rule 应当表达：

```text
触发条件或状态
→ 判断边界
→ 可观察行为或禁止行为
→ 停止条件或例外
```

候选规则不能仅仅因为听起来正确就获准进入。它必须在可复现条件下改变可观察行为。

### 3.6 准入条件

被接受的规则必须：

- 来源于真实或可复现的失败；
- 解决判断问题，而不是编码完整工作流；
- 能广泛适用于不同仓库和技术栈；
- 产生可观察的行为差异；
- 给出有效边界、禁止行为、停止条件或例外；
- 通过正向、近邻、冲突和过度遵循测试；
- 提供无法由 formatter、linter、schema、hook 或其他确定性机制更可靠实现的收益；
- 避免重复 Pi 已经可靠提供的行为；
- 证明其 Prompt Token 和行为成本是合理的。

当规则没有可测收益、造成实质回归、变得重复或过时，或者被可靠的确定性能力替代时，应当修改或删除。

## 4. 首批候选方向

第一批评测只包含三个候选方向，每个方向最多提出一个 Rule ID：

1. **范围控制**——避免无关修改和没有依据的范围扩张。
2. **证据诚实**——不得把未观察、不可用或未执行的验证报告为成功。
3. **关键不确定性**——在进行有实质影响的修改之前调查关键未知事实，而不是猜测。

这些是候选方向，不是已接受规则。只有在具备可复现失败和 Fixtures 后，才能提出精确规则文本。停止条件、例外和验证边界应写入相关规则，而不是拆成宽泛的独立指令。

其他来源材料可以进入盘点清单，但不会自动进入第一批。

## 5. Manifest 和 Byte 合同

Manifest 和 digest 是支撑两个产品职责的内部机制，不是独立产品。

包必须提供不可变 Manifest，至少标识：

- 包名和版本；
- Ruleset ID；
- 有序 Rule ID；
- 有序源文件；
- 精确 digest 算法；
- 精确规则 digest；
- 测得的 Token 数量；
- 支持的 Pi 版本。

规则 digest 为：

```text
sha256:<lowercase-hex>
```

它对按 Manifest 顺序组装的权威规则正文的精确 UTF-8 bytes 计算。每个规则源文件必须是不含 BOM 的 UTF-8，使用 LF 而不是 CRLF，并且末尾恰好包含一个 LF byte。组装时按照 Manifest 顺序直接拼接这些已经验证的原始文件 bytes，不插入额外分隔符。身份 Marker 位于被 Hash 的规则正文之外；最终注入块由 Marker、一个 LF byte 和组装后的正文组成。实现不得在计算 Hash 前归一化换行符、BOM、Unicode、Markdown 或空白。

注入文本必须具有固定 bytes 和固定顺序。不得包含时间戳、当前工作目录、Session ID、机器名、随机值或其他动态字段。

任何规则或顺序变化都会产生新 digest，并要求改变包版本。

## 6. Pi Adapter 合同

Pi 是 v0 唯一支持的宿主。虽然只实现和测试 Pi 集成，权威规则内容仍保持宿主中立。

### 6.1 SDK 路径

SDK Adapter 应通过 Pi 的资源加载系统，使用 `appendSystemPromptOverride` 或固定 Pi 版本中精确对应的受支持机制，注入固定规则块。

### 6.2 CLI 路径

CLI Adapter 应使用幂等的 `before_agent_start` Extension Hook，或者固定 Pi 版本中精确对应的受支持机制。

### 6.3 Adapter 职责

Adapter 必须将其行为限制在以下职责内：

- 加载不可变包资源；
- 组装固定的 `core` Ruleset；
- 计算或验证其 digest；
- 注入固定文本；
- 检测相同的重复注入；
- 报告冲突注入；
- 为诊断展示包、Ruleset、版本和 digest。

Adapter 不得：

- 注册执行工具；
- 访问网络；
- 修改仓库；
- 发现或修改 `AGENTS.md`；
- 在 Pi 正常执行状态之外保存业务或 Session 状态；
- 根据用户关键词选择规则；
- 在 Session 中修改规则；
- 声称能够强制模型行为。

### 6.4 Session 冻结和幂等

一个 Pi Session 具有一个冻结的 Ruleset 身份。改变包版本、规则 bytes、顺序或 digest，需要新 Session，或者由宿主显式 reload 并创建新的有效上下文。

注入块包含稳定 Marker，标识：

- `package=@cynos-ai/rules`；
- 包版本；
- `ruleset=core`；
- 规则 digest。

如果完全相同的 package、version、ruleset 和 digest Marker 已经恰好存在一次，Adapter 跳过重复注入。如果 Cynos Rules Marker 的任意身份字段不同、格式错误或出现超过一次，Adapter 应明确失败，而不是组合或静默接受多个身份。

### 6.5 不允许隐式资源

测试和 Benchmark Profile 必须使用隔离的 Pi 资源目录。它们必须证明没有加载用户全局或项目本地 Skills、无关 Extensions 和可变 Prompt。Skills 不属于 v0。

### 6.6 版本固定

Pi 是 `0.x` 依赖。开发、测试和 Benchmark 必须固定精确 Pi 版本。v0 兼容性 Spike 选择了 `@earendil-works/pi-coding-agent@0.84.3`，并将其记录在 Lockfile 和 Manifest 中。升级 Pi 必须先通过兼容性测试和经过 Review 的设计更新，才能发布。

## 7. npm 包与仓库边界

npm 包只包含用户运行时所需材料：

- 权威规则；
- Manifest；
- 编译后的合同辅助代码；
- Pi SDK 和 CLI Adapter 代码；
- License 和必要的包文档。

npm 包不得包含 Harbor、Python 依赖、Benchmark 数据集、Campaign 结果、原始 Trace、容器日志和 GitHub Workflow 材料。

最小目标仓库结构为：

```text
rules/
  core/
    <RULE-ID>.md
  manifest.json
src/
  index.ts
  pi/
    sdk.ts
    cli.ts
tests/
  fixtures/
integrations/
  harbor/
.github/
  ISSUE_TEMPLATE/
  workflows/
docs/
  zh-CN/
DESIGN.md
DESIGN.zh-CN.md
README.md
README.zh-CN.md
CONTRIBUTING.md
LICENSE
package.json
```

如果实现期间发现更简单的结构能够保持相同边界，可以调整此布局。目录名称不是产品架构。

## 8. 开源变更流程

Cynos Rules 使用普通 GitHub Issues 和 Pull Requests。它不实现独立的提案协议或状态机。

### 8.1 Rule Proposal Issue

Rule Proposal Issue 记录：

- 观察到的真实或可复现失败；
- 为什么现有已接受规则不足；
- 提议的判断边界；
- 可用时提供候选精确英文文本；
- Trigger、可观察行为、停止条件和例外；
- 正向、近邻、冲突和过度遵循场景；
- 考虑过的确定性替代方案；
- 预注册评测计划。

Issue Label 用来区分新增、修改、删除、缺少证据、评测发现、Harness 缺陷和 Benchmark 缺陷。

### 8.2 Rule Pull Request

规则 Pull Request 包含：

- 一个逻辑 Rule ID 变更；
- 精确权威文本；
- Manifest 和 digest 更新；
- 相关 Fixtures；
- Token 预算影响；
- 关联 Proposal Issue；
- 关联 Baseline 和 Candidate Harbor Job；
- 任务级结果摘要；
- 回归、意外行为和限制。

报告可以建议接受、修改、拒绝、删除，或给出结论不足。自动化不得仅根据分数合并规则或修改默认 Ruleset。维护者通过正常 Review 和 Merge 做最终决策。

### 8.3 初始发布

在 `@cynos-ai/rules@0.1.0` 之前，所有初始候选都保留为 Proposal Issues 以及分支或 Pull Requests。未经验证的 provisional 规则不得作为默认包发布。

只要有任意正数条规则被接受，就可以发布 `0.1.0`。如果所有初始候选都失败，在至少一条规则证明值得进入之前，不发布该包。

## 9. 评测架构

Cynos Rules 不开发自研评测平台。

评测链路为：

```text
Cynos Rules + Pi Adapter
→ 轻量 Harbor Pi 集成
→ Harbor 数据集和容器执行
→ Benchmark Patch Artifact
→ 上游官方 Evaluator
→ GitHub Issue/PR 证据
```

### 9.1 权威职责划分

Harbor 负责解析任务、容器执行、并发、超时、Trial/Job 记录、日志、Patch 收集和开发阶段评分。

上游 Benchmark Evaluator 是 Patch 是否解决任务的最终权威。Baseline Pilot 和候选初筛可以只使用 Harbor 开发阶段评分。对于发布证据，当 Harbor 本身不是官方 Evaluator 时，每个 Dev-30 和 Confirm-100 Patch 都必须使用官方 Evaluator 重新评测。

Cynos Rules 只提供安装固定版本 Pi 和本包、选择 Vanilla 或启用 Rules 的执行方式、保持环境隔离、捕获 Pi 事件日志以及记录配置身份所需的轻量集成。

### 9.2 Benchmark 数据集

v0 的真实 Issue Benchmark 是通过 Harbor 运行的 SWE-bench Verified。

仓库预注册：

- 五题 Baseline Pilot 集；
- 30 题开发集，每个候选的五到十个初筛任务从中选择；
- 100 题确认集。

Pilot、开发和确认集彼此互斥。初筛任务是开发集内明确记录的子集。

初始集合使用确定性选择方法：

1. 验证并记录精确的 500 题数据集 Revision 和 digest。
2. 按以下顺序生成集合：`pilot-5`、`dev-30`、`confirm-100-g1`。
3. 生成每个集合时，排除所有已经进入更早集合的任务。
4. 当任务属于已记录的 500 题 Revision，且没有进入更早集合或 Retired Task List 时，它就是 Eligible；v0 不应用其他质量过滤。按各源仓库剩余 Eligible Task 数量的比例，使用 Hamilton 最大余数法分配集合名额。余数相同时，按仓库名称升序打破平局。
5. 在每个仓库内，按 `sha256("cynos-rules-v0\n" + setId + "\n" + taskId)` 升序排列任务，并选取该仓库分配到的数量。
6. 在观察任何候选结果之前，提交选择脚本、数据集身份和精确 Task ID。

每个候选的五到十个初筛任务从 Dev-30 中选择，相关性标准写入其 Proposal Issue，并在运行该候选前冻结。剩余 Verified 任务组成 Reserve。完整 500 题保留给后续里程碑或公开 Full Run，v0 不要求执行。

### 9.3 实验条件

v0 只有两个正式 Benchmark 条件：

```text
A. Vanilla Pi
B. 相同 Pi + @cynos-ai/rules
```

模型、Provider、Pi 版本、工具、任务、基础仓库状态、预算、超时和 Evaluator 必须相同。Rules 是唯一预期变量。

两个条件都不加载 Skills。

正式 Pass@1 条件每题只产生一个 Patch。不允许 best-of-N、模型级联、人工挑选 Patch 或从重试中挑选结果。

只有在因为 Provider 传输失败、容器初始化失败或等价的推理前 Harness 失败，导致没有有效模型响应到达 Agent 时，Trial 才属于 `INFRASTRUCTURE`。这种 Trial 可以按照冻结的重试政策重试。一旦有效模型响应到达 Agent，拒绝、错误 Tool Call、Agent 崩溃、超时、没有产出 Patch，或者之后发生容器/Harness 崩溃，都属于 `AGENT_FAILURE`，不得为了挑选结果而重试。因为 Campaign 达到预算上限而没有启动的任务属于 `NOT_STARTED_BUDGET`，不属于基础设施重试，也不属于计分结果。

当所有 Baseline 输入和身份完全一致时，可以在同一预注册 Campaign 的多个候选之间复用冻结的 Baseline 结果。如果模型、Pi、工具、任务、预算、Prompt、Provider 行为或评测合同发生变化，则不得复用。

## 10. 评测漏斗

评测分阶段进行，避免较弱候选消耗大量 Benchmark 预算。

### 10.1 Baseline 校准

评测任何候选规则前，先运行包含以下内容的 Baseline Pilot：

- 五到十个合成行为 Fixtures；
- 五个 SWE-bench Verified 任务；
- 只运行 Vanilla Pi。

Pilot 测量 Tool Call 兼容性、有效 Patch 产出、Token 使用、费用、时长、基础设施失败率和 Baseline 任务表现。它用于在观察候选结果之前冻结超时、并发、重试规则、预算和数值 Gate。

### 10.2 候选阶段

首批三个候选方向分别经过：

1. 静态合同检查；
2. 定向正向和负向行为 Fixtures；
3. 五到十个相关开发 Issue 任务；
4. 相对冻结 Baseline 的 add-one 比较。

只有通过这些阶段的候选才能进入 provisional 组合 Ruleset。

### 10.3 组合阶段

provisional Ruleset 通过以下测试：

- 完整组合；
- 对组合中的每条规则进行一次 full-minus-one 比较；
- 冲突和过度遵循 Fixtures；
- 完整组合和每个 full-minus-one 比较都使用完整 30 题开发集。

US$30 的 Dev-30 上限覆盖 Dev-30 Campaign 的共享 Vanilla Pi Baseline Arm、完整组合和所有 full-minus-one Trial；它不是指更早的 US$5 Baseline Pilot。如果该上限无法提供要求数量的有效配对，Campaign 会阻止发布；除非显式批准新预算，并在新身份下重新启动 Dev-30 Campaign。

文本和组合冻结后，一个 Release Candidate Ruleset 身份针对未接触的 100 题确认集进行评测。只有预注册的基础设施重试可以为这个未改变的身份重复 Trial。

确认任务不参与文本或阈值选择。如果使用任何确认集发现改变规则文本、组合、阈值或其他评测选择，整个已经暴露的确认集都必须加入已提交的 Retired Task List；改变后的 Release Candidate 需要新选择的未接触确认集。

替代确认集使用第 9.2 节中的相同算法和下一个 Generation ID（`confirm-100-g2`，然后是 `g3`，依此类推），并排除所有 Pilot、开发、历史确认和 Retired Task。其精确 ID 必须在改变后的 Release Candidate 运行前提交。如果剩余未接触 Eligible Task 少于 100 个，v0 就不能再声称从该数据集获得另一组 100 题确认。Retired 或此前已经暴露的任务永远不得再次作为未接触的确认证据。

### 10.4 必需的结果形式

候选规则必须改善其目标可观察行为，并满足预注册的不回归、成本和过度遵循 Gate。聚合 Issue Resolve 很重要，但不是判断单条规则的唯一标准。

小样本可能结论不足。项目必须报告配对任务结果和不确定性，而不能把噪声包装成正向结论。

## 11. 模型 Profile

v0 评测使用 DeepSeek 官方 API。

请求的 API Model ID 为：

```text
deepseek-v4-flash
```

初始 Campaign 要求解析到的模型版本为：

```text
DeepSeek-V4-Flash-0731
```

Provider 记录为 DeepSeek 官方 API。在 Campaign 开始和完成时，证据记录请求 Model ID、API 返回的 Model ID、官方发布的 Alias 到版本映射、获取时间，以及该映射证据的 digest。如果发布的映射在 Campaign 前发生变化，必须重新运行 Baseline，并改变 Campaign 身份。如果在正式 Campaign 期间观察到已发布或 API 返回的模型变化，混合 Campaign 无效，不得作为一个结果报告。报告必须披露：Provider Alias 无法防止未公开的服务端变化。

初始推理配置为开启 Thinking，`reasoning_effort=low`。单个任务失败不得触发自动提升推理强度。如果 Baseline Pilot 出现 Tool Call 不稳定，或者五个干净执行的 Issue 任务全部未解决，则废弃该 Pilot，并从头使用 `reasoning_effort=high` 重跑。如果替代 Pilot 通过，`high` 将应用于 v0 后续所有初筛、开发和确认运行。一旦开始候选评测，推理强度即被冻结。

v0 正式比较不包含其他模型。

## 12. 预算和无人值守执行

正式评测必须在没有人监督单个任务或回答提示的情况下运行。

维护者批准 Campaign 和预算，然后 Harbor 完成工作、写入 Artifact 并返回最终状态。应同时说明本地执行和可信 GitHub `workflow_dispatch` 执行。不需要长期运行的 Cynos 自研服务。

初始 API 费用硬上限为：

| Campaign | API 费用上限 |
| --- | ---: |
| Baseline Pilot | US$5 |
| 三个初始候选的初筛 | US$15 |
| Dev-30 配对评测 | US$30 |
| Confirm-100 配对评测 | US$100 |

轻量集成根据 Provider 返回的 Token Usage 和记录在 Campaign Manifest 中的价格快照计算费用。启动每个 Trial 前，它把累计费用加上保守的单 Trial Reserve 与上限比较。达到上限后，停止启动新 Trial。已经开始的 Trial 可以完成，因此最终费用最多可以超出上限一个已记录的 In-flight Reserve。基础设施重试计入上限。系统不得自动充值、切换 Provider 或静默提高预算。改变预算或价格快照会创建新的显式 Campaign 身份。

完整 500 题运行需要未来单独批准。

出于安全考虑，外部贡献的付费评测只能在维护者通过 `eval-approved` 等方式明确批准后，从经过 Review 的 commit 在可信 Runner 上运行。不可信 Pull Request 代码不得获得模型凭据。

## 13. 评测发现与规则学习

每个完成的 Campaign 都会产生一个持久的 Evaluation Findings Issue，或者更新一个 Campaign 专用 Issue。

Campaign 摘要至少记录：

- Campaign、任务、模型、Pi、Ruleset 和 Evaluator 身份；
- 相关 digest；
- 每题的 Baseline 和 Candidate 结果；
- Patch 和 Trace Artifact 引用；
- 可用时记录 Token 使用、费用和时长；
- 基础设施和 Tool Call 失败；
- 基于事实的失败分类。

计分的配对结果分类为：

```text
PASS / PASS
FAIL / PASS
PASS / FAIL
FAIL / FAIL
```

非计分 Trial 状态按照第 9.3 节单独报告为 `INFRASTRUCTURE`、`AGENT_FAILURE` 或 `NOT_STARTED_BUDGET`。构建有效配对时，`AGENT_FAILURE` 计为 Agent 失败结果；另外两种状态不计入。

Evaluation Finding 是观察记录，不会自动成为 Rule Proposal。只有当行为可复现、可泛化、可能由判断指导改变，并且不适合通过确定性机制、宿主修复、模型修复或 Benchmark 修复解决时，维护者才会提升该 Finding。

Workflow 应创建一个 Campaign 级摘要，而不是为每个失败任务创建一个 Issue。只有值得集中调查时，才拆分独立 Finding。

## 14. 证据保留

v0 使用 Harbor 和 GitHub 存储，不引入外部 Artifact 服务。

- 原始 Pi Trace、容器日志和完整工作区 Artifact 作为 GitHub Actions Artifacts 保留 30 天。
- Evaluation Findings Issues 保留任务级摘要、分类、Artifact 标识符和 digest。
- Rule Pull Requests 保留 Baseline/Candidate 摘要和 Finding 链接。
- Release 包含一个紧凑评测证据包，内含 Campaign Manifest、规范化任务级结果和报告，并作为 GitHub Release Asset 发布。
- Release Notes 记录评测证据包的 SHA-256 digest。
- 大型原始 Trace 不提交到 Git。

上传 Artifact 前必须清除 Secret 和凭据。

## 15. 安全与公平性

Agent 不得接收或访问：

- Gold Patch；
- 隐藏 Verifier 测试；
- 用户任务中不存在的 fail-to-pass 或 pass-to-pass 标注；
- 历史答案；
- 官方 Verifier 内部实现；
- 运行所需最小范围模型凭据之外的其他凭据。

Benchmark 代码只能在数据集的一次性容器或等价 Sandbox 中执行。环境不含生产凭据、宿主 Docker Socket 或无关可写宿主挂载。网络访问仅限 Benchmark 和模型调用所需范围。

Harbor 集成必须有负向测试，证明评测专用文件和 Solution 材料对 Agent 不可见。如果无法建立这种隔离，就阻止正式 Benchmark 执行。

Prompt Rules 是 Guidance，不是 Enforcement。安全声明依赖容器、凭据、网络和 Evaluator 边界，而不是模型遵从性。

## 16. 文档和可复现性

英文是项目权威语言。每篇教程和实质性项目文档都具有逐篇对应的中文翻译。CI 应检测缺失的翻译对应文件和过期的同步标记。

Fresh Clone 必须说明如何：

1. 安装精确锁定的依赖；
2. 在没有模型 Key 的情况下运行离线单元和合同测试；
3. 检查 Docker、Harbor、Pi 和 Provider 前置条件；
4. 运行合成 Smoke Evaluation；
5. 运行 Vanilla 和启用 Rules 的 Harbor Profile；
6. 让 Campaign 无人值守运行；
7. 检查状态和 Artifact；
8. 生成或附加 Evaluation Findings 摘要。

Workflow 不得依赖维护者的 `~/.pi` 目录、私有 Prompt、聊天历史、未提交 Task List 或私有脚本。模型凭据由操作者提供，绝不提交。

## 17. 发布 Gate

只有满足以下条件才能发布 `0.1.0`：

- 至少一个 Rule Proposal 通过 Review 被接受；
- 完整权威注入文本符合 v0 Token 预算；
- Manifest、digest、幂等、冲突和 Session 冻结测试通过；
- Pi SDK 和 CLI Adapter 测试在一个精确固定的 Pi 版本上通过；
- 隔离资源测试证明没有隐式 Skills 或无关 Extensions；
- 合成正向、近邻、冲突和过度遵循 Fixtures 按预注册 Gate 通过；
- 完整 Dev-30 组合和每个必需的 full-minus-one 比较都至少产生 29 个有效配对，Confirm-100 至少产生 95 个；`NOT_STARTED_BUDGET` 和未解决的 Infrastructure Trial 不计入这些最低数量；
- 低于任一完成数量下限的 Campaign 会阻止发布，而不是仅以结论不足通过；
- 官方 Evaluator 结果和配对任务数据可用；
- 安全和答案隔离检查通过；
- 英文和中文文档同步；
- Fresh Clone 读者可以遵循已记录的测试路径；
- Release 评测证据包和 digest 已准备完毕。

失败或结论不足的候选不会阻止无关的已接受规则发布。它只是不进入权威 Manifest。

## 18. 实现顺序

实现按照本文档依次进行：

1. 创建 MIT 仓库和最小英文/中文文档骨架；
2. 运行 Pi 兼容性 Spike，选择一个精确版本，并证明能够检查 Effective Prompt Marker；如果不能，在实现 Adapter 前停止并修订本文档；
3. 实现不可变规则组装、Manifest 验证、digest、Marker 逻辑和精确 Token 数检查；
4. 针对选定的精确 Pi 版本实现并测试 Pi SDK 和 CLI Adapter；
5. 创建 GitHub Issue 和 Pull Request 模板；
6. 实现轻量 Harbor Pi 集成和隔离 Profile，包括基于 Usage 的预算核算和 Artifact 脱敏；
7. 实现离线 Fixtures 和 Fresh Clone Smoke Test；
8. 运行 Baseline 兼容性和校准 Pilot；
9. 冻结数值 Gate，并提交确定性 Task List；
10. 创建三个初始 Rule Proposal Issues；
11. 逐条评测候选，然后评测组合 provisional Ruleset；
12. 只有在发布 Gate 通过后才发布。

不得仅仅因为某段代码出现在早期对话或研究文档中就实现它。本文档是实现权威。

## 19. 本设计的变更控制

设计变更使用普通 GitHub Issue 和经过 Review 的 Pull Request。Pull Request 必须指出：

- 现有规范性陈述；
- 提议的替代内容；
- 当前设计为什么不足；
- 对 Runtime bytes、兼容性、评测有效性、安全性和仓库复杂度的影响。

实现不得静默重新定义产品边界。特别是，评测支持必须保持为围绕 Harbor 和官方 Evaluator 的轻量集成，除非证据证明值得通过独立 Review 扩展。
