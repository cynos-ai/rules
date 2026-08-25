# Cynos Rules v0 — Authoritative Design

- Status: **Approved for implementation**
- Authority: **Normative for v0**
- Product: **Cynos Rules**
- Repository: **`cynos-ai/rules`**
- Package: **`@cynos-ai/rules`**
- License: **MIT**

This document is the authoritative design for Cynos Rules v0. Implementation, tests, documentation, contribution workflows, and release decisions MUST conform to it. If another document conflicts with this one, this document wins until a reviewed change updates it.

The Chinese translation is `DESIGN.zh-CN.md`. The English document is canonical. Translation differences do not change the design.

## 1. Mission

Cynos Rules provides a very small set of evidence-tested judgment rules for coding agents.

> **Teach judgment, not recipes. Test every rule.**

Rules are hypotheses, not commandments. Every rule must earn the permanent system-prompt tokens it consumes.

The product is intentionally small. Most of the work required to maintain it is validation, not rule volume.

## 2. Product Boundary

Cynos Rules v0 has only two product responsibilities:

1. ship the accepted canonical rules; and
2. inject those rules deterministically into Pi.

The repository also contains the minimum integration and documentation needed to evaluate those two responsibilities with existing open-source infrastructure.

### 2.1 Included in v0

- one canonical English `core` ruleset;
- a manifest and digest needed to identify that ruleset;
- a Pi SDK adapter;
- a Pi CLI adapter;
- a thin Harbor integration for evaluating Pi with and without the rules;
- deterministic tests for content, digest, injection, and Pi compatibility;
- GitHub Issue and Pull Request templates for rule proposals;
- instructions for local and unattended evaluation;
- English documentation and article-for-article Chinese translations.

### 2.2 Explicitly excluded from v0

- a custom evaluation platform, scheduler, database, dashboard, or web service;
- a separately branded rule laboratory;
- a custom proposal state machine or proposal file hierarchy;
- Skills;
- adapters for hosts other than Pi;
- project-memory management;
- creating, generating, or modifying a user's `AGENTS.md`;
- tools, MCP servers, network access, repository mutation, or business state in the runtime adapter;
- policy enforcement or claims that prompt guidance is a security boundary;
- dynamic rule selection based on user messages;
- module switches, per-rule switches, custom rule paths, or environment-variable rule overrides;
- benchmark-specific answers, hidden tests, gold patches, or task-specific hints.

Excluded capabilities may be reconsidered only after v0 evidence demonstrates a real need. They are not implied roadmap commitments.

## 3. Canonical Ruleset

### 3.1 One fixed ruleset

v0 has exactly one ruleset named `core`.

Registering the adapter loads the complete `core` ruleset. Not registering the adapter produces Vanilla Pi. There is no runtime enable/disable switch inside the adapter and no supported partial combination.

The accepted rules are expected to be useful together. If a rule does not justify default inclusion, it does not belong in v0.

### 3.2 Size budget

The complete injected block, including its identity marker, MUST contain no more than 400 tokens when measured with the `o200k_base` tokenizer. This is a reproducible v0 admission metric, not a claim that every provider uses the same tokenizer. The manifest and release report MUST record the measured count.

The initial batch contains at most three proposed Rule IDs, one for each direction in Section 4. The first release may contain any positive subset of those three. It MUST NOT weaken evidence gates merely to reach a target count. If no candidate passes, no runtime package is released.

### 3.3 Language

Canonical runtime rules are English only. Pi receives the same English bytes regardless of the user's language.

Chinese translations are documentation for readers. They are not a second runtime ruleset, do not participate in the runtime digest, and MUST NOT be injected in place of the canonical text.

### 3.4 Stable identity

Each accepted rule has a stable Rule ID. A proposal Issue and its Pull Request normally add, modify, or remove exactly one Rule ID. Independent rules MUST NOT be bundled into one Pull Request. A semantic unit that cannot reasonably be separated may be an exception when the Pull Request explains why.

### 3.5 Required rule shape

A runtime rule SHOULD express:

```text
Trigger or state
→ judgment boundary
→ observable action or prohibition
→ stopping condition or exception
```

A candidate is not admitted merely because it sounds desirable. It must change observable behavior under a reproducible condition.

### 3.6 Admission criteria

An accepted rule MUST:

- originate from a real or reproducible failure;
- address a judgment problem rather than encode a complete workflow;
- be broadly applicable across repositories and technology stacks;
- produce an observable behavioral difference;
- state an effective boundary, prohibition, stop condition, or exception;
- survive positive, near-neighbor, conflict, and over-following tests;
- provide benefit that cannot be implemented more reliably by a formatter, linter, schema, hook, or other deterministic mechanism;
- avoid duplicating behavior already provided reliably by Pi;
- justify its prompt-token and behavioral cost.

A rule SHOULD be modified or removed when it has no measurable benefit, causes material regressions, becomes redundant, becomes obsolete, or is replaced by a reliable deterministic capability.

## 4. Initial Candidate Directions

The first evaluation batch is limited to three candidate directions and at most one proposed Rule ID per direction:

1. **Scope control** — avoid unrelated changes and unjustified scope expansion.
2. **Evidence honesty** — do not report unobserved, unavailable, or unexecuted verification as successful.
3. **Material uncertainty** — investigate material unknowns before making consequential changes instead of guessing.

These are candidate directions, not accepted rules. Exact rule text MUST be proposed only after a reproducible failure and fixtures exist. Stopping conditions, exceptions, and verification boundaries belong in the relevant rule rather than in broad standalone instructions.

Other source material may be inventoried, but it does not enter the first batch automatically.

## 5. Manifest and Byte Contract

The manifest and digest are internal mechanisms supporting the two product responsibilities; they are not separate products.

The package MUST provide an immutable manifest that identifies at least:

- package name and version;
- ruleset ID;
- ordered Rule IDs;
- ordered source files;
- exact digest algorithm;
- exact rules digest;
- measured token count;
- supported Pi version or versions.

The rules digest is:

```text
sha256:<lowercase-hex>
```

computed over the exact UTF-8 bytes of the assembled canonical rule body in manifest order. Every rule source file MUST be UTF-8 without a BOM, use LF rather than CRLF, and end with exactly one LF byte. Assembly directly concatenates those validated raw file bytes in manifest order without inserting another separator. The identity marker is outside the hashed rule body; the final injected block is the marker, one LF byte, and the assembled body. The implementation MUST NOT normalize line endings, BOMs, Unicode, Markdown, or whitespace before hashing.

The injected text MUST have fixed bytes and fixed order. It MUST NOT contain a timestamp, current working directory, session ID, machine name, random value, or other dynamic field.

Any rule or order change produces a new digest and requires a package version change.

## 6. Pi Adapter Contract

Pi is the only supported host in v0. The canonical rule content remains host-neutral even though only Pi integration is implemented and tested.

### 6.1 SDK path

The SDK adapter SHOULD inject the fixed rules block through Pi's resource-loading system using `appendSystemPromptOverride` or the exact supported equivalent in the pinned Pi version.

### 6.2 CLI path

The CLI adapter SHOULD use an idempotent `before_agent_start` extension hook or the exact supported equivalent in the pinned Pi version.

### 6.3 Adapter responsibilities

The adapter MUST limit its behavior to the following responsibilities:

- load immutable package resources;
- assemble the fixed `core` ruleset;
- calculate or verify its digest;
- inject the fixed text;
- detect identical duplicate injection;
- report conflicting injection;
- expose package, ruleset, version, and digest for diagnostics.

The adapter MUST NOT:

- register execution tools;
- access the network;
- modify the repository;
- discover or modify `AGENTS.md`;
- store business or session state outside Pi's normal execution state;
- choose rules based on user keywords;
- mutate the rules during a session;
- claim to enforce model behavior.

### 6.4 Session freeze and idempotency

One Pi session has one frozen Ruleset identity. Changing package version, rule bytes, order, or digest requires a new session or an explicit host-level reload that starts a new effective context.

The injected block contains a stable marker identifying:

- `package=@cynos-ai/rules`;
- package version;
- `ruleset=core`;
- rules digest.

If the exact same package, version, ruleset, and digest marker is already present once, the adapter skips duplicate injection. If a Cynos Rules marker differs in any identity field, is malformed, or appears more than once, the adapter fails clearly rather than combining or silently accepting identities.

### 6.5 No implicit resources

Tests and benchmark profiles MUST use an isolated Pi resource directory. They MUST demonstrate that user-global or project-local Skills, unrelated extensions, and mutable prompts are not loaded. Skills are not part of v0.

### 6.6 Version pinning

Pi is a `0.x` dependency. Development, tests, and benchmarks MUST pin an exact Pi version. The v0 compatibility spike selected `@earendil-works/pi-coding-agent@0.84.3`; it is recorded in the lockfile and manifest. A Pi upgrade requires compatibility tests and a reviewed design update before release.

## 7. Package and Repository Boundary

The npm package contains only runtime material needed by users:

- canonical rules;
- manifest;
- compiled contract helpers;
- Pi SDK and CLI adapter code;
- license and necessary package documentation.

The npm package MUST exclude Harbor, Python dependencies, benchmark datasets, campaign results, raw traces, container logs, and GitHub workflow material.

A minimal target repository shape is:

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

This layout may be adjusted during implementation when a simpler structure preserves the same boundary. Directory names are not product architecture.

## 8. Open-Source Change Workflow

Cynos Rules uses normal GitHub Issues and Pull Requests. It does not implement a separate proposal protocol or state machine.

### 8.1 Rule Proposal Issue

A Rule Proposal Issue records:

- observed real or reproducible failure;
- why existing accepted rules are insufficient;
- proposed judgment boundary;
- candidate exact English text when available;
- trigger, observable behavior, stop condition, and exceptions;
- positive, near-neighbor, conflict, and over-following scenarios;
- deterministic alternatives considered;
- pre-registered evaluation plan.

Issue labels distinguish additions, modifications, removals, missing evidence, evaluation findings, harness defects, and benchmark defects.

### 8.2 Rule Pull Request

A rule Pull Request includes:

- one logical Rule ID change;
- exact canonical text;
- manifest and digest update;
- relevant fixtures;
- token-budget effect;
- linked Proposal Issue;
- linked Baseline and Candidate Harbor jobs;
- task-level result summary;
- regressions, unexpected behavior, and limitations.

Reports may recommend acceptance, modification, rejection, removal, or an inconclusive outcome. Automation MUST NOT merge a rule or modify the default ruleset based only on a score. Maintainers make the final decision through normal review and merge.

### 8.3 Initial publication

Before `@cynos-ai/rules@0.1.0`, all initial candidates remain Proposal Issues and branches or Pull Requests. Unvalidated provisional rules MUST NOT be published as the default package.

Version `0.1.0` may be released with any positive number of accepted rules. If all initial candidates fail, the package is not released until at least one rule earns inclusion.

## 9. Evaluation Architecture

Cynos Rules does not build a custom evaluation platform.

The evaluation chain is:

```text
Cynos Rules + Pi adapter
→ thin Harbor Pi integration
→ Harbor dataset and container execution
→ benchmark patch artifact
→ upstream official evaluator
→ GitHub Issue/PR evidence
```

### 9.1 Authority split

Harbor is responsible for task resolution, container execution, concurrency, timeouts, trial/job records, logs, patch collection, and development scoring.

The upstream benchmark evaluator is the final authority for whether a patch resolves a task. Harbor development scoring is sufficient for the Baseline Pilot and candidate screening. For release evidence, every Dev-30 and Confirm-100 patch MUST be re-evaluated with the official evaluator when Harbor is not itself the official evaluator.

Cynos Rules provides only the thin integration needed to install pinned Pi and the package, select Vanilla or Rules-enabled execution, keep the environment isolated, capture Pi's event log, and record configuration identity.

### 9.2 Benchmark dataset

The v0 real-Issue benchmark is SWE-bench Verified through Harbor.

The repository pre-registers:

- a five-task Baseline Pilot set;
- a 30-task development set, from which each candidate's five to ten screening tasks are selected;
- a 100-task confirmation set.

The Pilot, development, and confirmation sets are mutually disjoint. Screening tasks are an explicitly recorded subset of the development set.

Initial set selection is deterministic:

1. Verify and record the exact 500-task dataset revision and digest.
2. Generate sets in this order: `pilot-5`, `dev-30`, then `confirm-100-g1`.
3. For each set, remove every task already selected for an earlier set.
4. A task is eligible when it belongs to the recorded 500-task revision and has not been selected for an earlier set or placed on the retired-task list; v0 applies no additional quality filter. Allocate the requested set size among source repositories with Hamilton's largest-remainder method, proportional to each repository's remaining eligible task count. Break equal remainder ties by ascending repository name.
5. Within each repository, order tasks by ascending `sha256("cynos-rules-v0\n" + setId + "\n" + taskId)` and take its allocated count.
6. Commit the selection script, dataset identity, and exact task IDs before any candidate result is observed.

A candidate's five to ten screening tasks are chosen from Dev-30 using relevance criteria stated in its Proposal Issue and frozen before that candidate runs. The remaining Verified tasks form the reserve. The complete 500-task dataset is reserved for a later milestone or public full run and is not required for v0.

### 9.3 Experimental conditions

v0 has exactly two formal benchmark conditions:

```text
A. Vanilla Pi
B. The same Pi + @cynos-ai/rules
```

The model, provider, Pi version, tools, task, base repository state, budgets, timeouts, and evaluator MUST be the same. The rules are the only intended variable.

No Skills are loaded in either condition.

A formal Pass@1 condition produces one patch per task. There is no best-of-N, model cascade, human patch selection, or selection among retries.

A trial is `INFRASTRUCTURE` only when no valid model response reached the agent because of provider transport failure, container setup failure, or equivalent pre-inference harness failure. Such a trial may be retried under the frozen retry policy. Once a valid model response reaches the agent, refusal, malformed tool use, agent crash, timeout, failure to produce a patch, or a later container/harness crash is an `AGENT_FAILURE` and is not retried for selection. A task not started because the campaign reached its budget ceiling is `NOT_STARTED_BUDGET`, not an infrastructure retry or a scored result.

A frozen Baseline result may be reused across candidates within the same pre-registered campaign when every Baseline input and identity is identical. It MUST NOT be reused across a model, Pi, tool, task, budget, prompt, provider behavior, or evaluation-contract change.

## 10. Evaluation Funnel

Evaluation is staged to prevent weak candidates from consuming large benchmark budgets.

### 10.1 Baseline calibration

Before evaluating any candidate rule, run a Baseline Pilot containing:

- five to ten synthetic behavior fixtures;
- five SWE-bench Verified tasks;
- Vanilla Pi only.

The Pilot measures tool-call compatibility, valid patch production, token use, cost, duration, infrastructure failure rate, and baseline task performance. It is used to freeze timeouts, concurrency, retry rules, budgets, and numerical gates before candidate outcomes are observed.

### 10.2 Candidate stages

Each of the first three candidate directions proceeds through:

1. static contract checks;
2. targeted positive and negative behavior fixtures;
3. five to ten relevant development Issue tasks;
4. add-one comparison against the frozen Baseline.

Only candidates that pass these stages enter a provisional combined ruleset.

### 10.3 Combined stages

The provisional ruleset is tested through:

- the full combination;
- one full-minus-one comparison for every rule in that combination;
- conflict and over-following fixtures;
- the complete 30-task development set for both the full combination and every full-minus-one comparison.

The US$30 Dev-30 ceiling covers the Dev-30 campaign's shared Vanilla Pi Baseline arm, the full combination, and all full-minus-one trials; it does not refer to the earlier US$5 Baseline Pilot. If the ceiling cannot provide the required valid pairs, the campaign blocks release unless a new budget is explicitly approved and the Dev-30 campaign is restarted under a new identity.

After wording and composition are frozen, one release-candidate Ruleset identity is evaluated against the untouched 100-task confirmation set. Only pre-registered infrastructure retries may repeat a trial for that unchanged identity.

Confirmation tasks do not participate in wording or threshold selection. If any confirmation finding is used to change rule text, composition, thresholds, or other evaluation choices, the entire exposed confirmation set is added to the committed retired-task list; the changed release candidate requires a newly selected untouched confirmation set.

A replacement confirmation set uses the same algorithm in Section 9.2 with the next generation ID (`confirm-100-g2`, then `g3`, and so on) after excluding every Pilot, development, previous confirmation, and retired task. Its exact IDs are committed before the changed release candidate runs. If fewer than 100 untouched eligible tasks remain, v0 cannot claim another 100-task confirmation from that dataset. A retired or previously exposed task is never presented again as untouched confirmation evidence.

### 10.4 Required outcome shape

A candidate must improve its targeted observable behavior and satisfy pre-registered non-regression, cost, and over-following gates. Aggregate Issue resolution is important but is not the sole judge of an individual rule.

Small samples may be inconclusive. The project MUST report paired task outcomes and uncertainty rather than turning noise into a positive claim.

## 11. Model Profile

The v0 evaluation uses the DeepSeek official API.

The requested API model ID is:

```text
deepseek-v4-flash
```

For the initial campaign, the required resolved model version is:

```text
DeepSeek-V4-Flash-0731
```

The provider is recorded as DeepSeek official API. At campaign start and completion, the evidence records the requested model ID, the model ID returned by the API, the official published alias-to-version mapping, its retrieval time, and a digest of that mapping evidence. If the published mapping changes before a campaign, the Baseline is run again and the campaign identity changes. If a published or API-reported model change is observed during a formal campaign, the mixed campaign is invalid and must not be reported as one result. The report MUST disclose that a provider alias cannot protect against an undisclosed server-side change.

The initial reasoning configuration is thinking enabled with `reasoning_effort=low`. A task failure MUST NOT trigger an automatic effort increase. If the Baseline Pilot shows unstable tool calls or resolves zero of five cleanly executed Issue tasks, the Pilot is discarded and repeated from the beginning with `reasoning_effort=high`. If that replacement Pilot passes, `high` applies to every subsequent screening, development, and confirmation run in v0. Once candidate evaluation begins, reasoning effort is frozen.

No other model is part of v0 formal comparison.

## 12. Budgets and Unattended Execution

Formal evaluation MUST run without a person supervising individual tasks or answering prompts.

A maintainer approves the campaign and budget, then Harbor completes the work, writes artifacts, and returns a final status. Local execution and trusted GitHub `workflow_dispatch` execution SHOULD both be documented. No long-running custom Cynos service is required.

Initial hard API-cost ceilings are:

| Campaign | Maximum API cost |
| --- | ---: |
| Baseline Pilot | US$5 |
| Initial screening for three candidates | US$15 |
| Dev-30 paired evaluation | US$30 |
| Confirm-100 paired evaluation | US$100 |

The thin integration calculates spend from provider-reported token usage and a price snapshot recorded in the campaign manifest. Before starting each trial, it compares accrued spend plus a conservative per-trial reserve with the ceiling. At the ceiling, it stops starting new trials. Already-started trials may finish, so final spend may exceed the ceiling by no more than the recorded in-flight reserve. Infrastructure retries count against the ceiling. The system MUST NOT automatically recharge an account, switch providers, or silently increase a budget. A budget or price-snapshot change creates a new explicit campaign identity.

The full 500-task run requires separate future approval.

For security, paid evaluation of external contributions runs only from a reviewed commit on a trusted runner after explicit maintainer approval such as an `eval-approved` label. Untrusted Pull Request code MUST NOT receive model credentials.

## 13. Evaluation Findings and Rule Learning

Every completed campaign produces one persistent Evaluation Findings Issue or updates one campaign-specific Issue.

The campaign summary records at least:

- campaign, task, model, Pi, ruleset, and evaluator identities;
- relevant digests;
- Baseline and Candidate outcome per task;
- patch and trace artifact references;
- token use, cost, and duration when available;
- infrastructure and tool-call failures;
- a factual failure classification.

Scored paired outcomes are classified as:

```text
PASS / PASS
FAIL / PASS
PASS / FAIL
FAIL / FAIL
```

Non-scored trial states are reported separately as `INFRASTRUCTURE`, `AGENT_FAILURE`, or `NOT_STARTED_BUDGET` according to Section 9.3. An `AGENT_FAILURE` counts as a failed agent outcome when constructing a valid pair; the other two states do not.

An Evaluation Finding is an observation, not automatically a Rule Proposal. Maintainers promote a finding only when the behavior is reproducible, generalizable, plausibly changed by judgment guidance, and not better addressed by a deterministic mechanism, host fix, model fix, or benchmark fix.

The workflow SHOULD create one campaign-level summary rather than opening one Issue for every failed task. Individual findings are split only when they merit focused investigation.

## 14. Evidence Retention

v0 uses Harbor and GitHub storage rather than introducing an external artifact service.

- Raw Pi traces, container logs, and full workspace artifacts are retained as GitHub Actions Artifacts for 30 days.
- Evaluation Findings Issues retain task-level summaries, classifications, artifact identifiers, and digests.
- Rule Pull Requests retain the Baseline/Candidate summary and links to findings.
- A release includes a compact evaluation bundle containing the campaign manifest, normalized task-level results, and report as a GitHub Release Asset.
- Release notes record the evaluation bundle SHA-256 digest.
- Large raw traces are not committed to Git.

Secrets and credentials MUST be redacted before artifacts are uploaded.

## 15. Security and Fairness

The agent MUST NOT receive or access:

- gold patches;
- hidden verifier tests;
- fail-to-pass or pass-to-pass annotations not present in the user task;
- historical answers;
- official verifier internals;
- credentials other than the minimum scoped model credential needed for the run.

Benchmark code executes only in the dataset's disposable container or equivalent sandbox. The environment has no production credentials, host Docker socket, or unrelated writable host mounts. Network access is restricted to what the benchmark and model call require.

The Harbor integration MUST have negative tests demonstrating that evaluation-only files and solution material are not visible to the agent. If that isolation cannot be established, formal benchmark execution is blocked.

Prompt rules are guidance, not enforcement. Security claims rely on container, credential, network, and evaluator boundaries rather than model compliance.

## 16. Documentation and Reproducibility

English is the authoritative project language. Every tutorial and substantive project document has an article-for-article Chinese translation. CI SHOULD detect missing translation counterparts and stale synchronization markers.

A fresh clone MUST explain how to:

1. install exact locked dependencies;
2. run offline unit and contract tests without a model key;
3. check Docker, Harbor, Pi, and provider prerequisites;
4. run a synthetic smoke evaluation;
5. run Vanilla and Rules-enabled Harbor profiles;
6. leave a campaign unattended;
7. inspect status and artifacts;
8. produce or attach the Evaluation Findings summary.

The workflow MUST NOT depend on a maintainer's `~/.pi` directory, private prompt, chat history, uncommitted task list, or private script. Model credentials are supplied by the operator and never committed.

## 17. Release Gates

`0.1.0` may be released only when:

- at least one Rule Proposal has been accepted through review;
- the complete canonical injected text respects the v0 token budget;
- manifest, digest, idempotency, conflict, and session-freeze tests pass;
- Pi SDK and CLI adapter tests pass against an exact pinned Pi version;
- isolated-resource tests show no implicit Skills or unrelated extensions;
- synthetic positive, near-neighbor, conflict, and over-following fixtures pass according to their pre-registered gates;
- the full Dev-30 combination and every required full-minus-one comparison each produce at least 29 valid pairs, and Confirm-100 produces at least 95; `NOT_STARTED_BUDGET` and unresolved infrastructure trials do not count toward those minima;
- a campaign below either completion minimum blocks release rather than passing as merely inconclusive;
- official evaluator results and paired task data are available;
- security and answer-isolation checks pass;
- English and Chinese documentation are synchronized;
- a fresh-clone reader can follow the documented test path;
- the release evaluation bundle and digest are prepared.

A failing or inconclusive candidate does not block unrelated accepted rules from release. It simply stays out of the canonical manifest.

## 18. Implementation Order

Implementation follows this document in the following order:

1. create the MIT repository and minimal English/Chinese documentation scaffold;
2. run a Pi compatibility spike that selects one exact version and proves effective-prompt marker inspection is implementable; if it is not, stop and revise this design before adapter implementation;
3. implement immutable rule assembly, manifest validation, digest, marker logic, and the exact token-count check;
4. implement and test Pi SDK and CLI adapters against the selected exact Pi version;
5. create GitHub Issue and Pull Request templates;
6. implement the thin Harbor Pi integration and isolated profiles, including usage-based budget accounting and artifact redaction;
7. implement offline fixtures and fresh-clone smoke tests;
8. run the Baseline compatibility and calibration Pilot;
9. freeze numerical gates and commit the deterministic task lists;
10. open the three initial Rule Proposal Issues;
11. evaluate candidates one at a time, then evaluate the combined provisional set;
12. publish only after release gates pass.

Code MUST NOT be implemented merely because it appears in an earlier conversation or research document. This design is the implementation authority.

## 19. Change Control for This Design

A design change uses a normal GitHub Issue and reviewed Pull Request. The Pull Request must identify:

- the existing normative statement;
- the proposed replacement;
- why the current design is insufficient;
- effects on runtime bytes, compatibility, evaluation validity, security, and repository complexity.

Implementation MUST NOT silently redefine the product boundary. In particular, evaluation support must remain a thin integration around Harbor and official evaluators unless evidence justifies a separately reviewed expansion.
