# Rule Philosophy

## Mission

Cynos Rules teaches portable judgment to coding agents without turning the system prompt into a workflow manual.

> **Teach judgment, not recipes. Test every rule.**

Rules are hypotheses. Every rule must earn its permanent tokens through observable evidence.

## Product boundary

A runtime rule is short, host-neutral judgment guidance. It is not project memory, a technology guide, a template library, a Skill, a complete workflow, a tool policy, or a security control.

Repository conventions, framework preferences, fixed directory layouts, deployment recipes, commit formats, and organization-specific procedures do not belong in the canonical ruleset.

If a formatter, linter, schema, hook, type checker, sandbox, permission boundary, or other deterministic mechanism can solve the problem more reliably, use that mechanism instead of prompt text.

## Admission

A candidate rule needs all of the following:

1. a real or reproducible failure;
2. a material judgment error that existing rules do not cover;
3. an observable behavioral change;
4. applicability across repositories and technology stacks;
5. a clear boundary, prohibition, stop condition, or exception;
6. positive, near-neighbor, conflict, and over-following tests;
7. a pre-registered comparison against the unchanged baseline;
8. acceptable token, cost, and regression impact.

Broad aspirations such as “write elegant code,” “always think deeply,” or “follow best practices” are rejected unless converted into a bounded, observable judgment rule with evidence.

## Rule form

Prefer:

```text
Trigger or state
→ judgment boundary
→ observable action or prohibition
→ stopping condition or exception
```

A useful rule says when it applies and when it stops applying. It leaves task-specific implementation choices to the agent and project context.

## Evidence

Targeted fixtures determine whether the intended judgment changed. Real Issue tasks test whether that improvement survives realistic coding work without harming resolution, cost, or scope.

A higher benchmark score alone does not prove an individual rule. A lower score alone does not explain the cause. Use paired task evidence, inspect regressions, and report uncertainty honestly.

Confirmation tasks are not tuning material. Once their findings influence a change, retire the exposed set before making another confirmation claim.

## Context economy

System-prompt space is a scarce shared resource. Shorter is not automatically better, but every word must contribute to a tested decision boundary. Redundancy, examples that do not alter interpretation, and instructions already implemented by Pi should be removed.

The complete v0 injected block, including its identity marker, is limited by the authoritative design.

## Authority and conflict

System and host instructions remain above Cynos Rules. Explicit user requirements and pinned project context define the task. Cynos Rules must not claim authority over acceptance decisions, credentials, permissions, hidden tests, or external policy.

Prompt guidance cannot enforce a security boundary. Containers, credentials, network controls, and official evaluators provide those boundaries.

## Lifecycle

Add, modify, and remove rules through normal GitHub Issues and Pull Requests. A rule is expected to change or disappear when evidence shows no benefit, harmful over-following, excessive cost, redundancy, obsolescence, or replacement by a deterministic capability.

The goal is not to accumulate rules. The goal is to preserve the smallest set that continues to improve observable judgment.

## Non-goals

Cynos Rules does not aim to:

- encode every software-engineering practice;
- replace tests, review, or project documentation;
- make all models behave identically;
- guarantee correctness or compliance;
- optimize for one benchmark through task-specific hints;
- become a general Agent framework.
