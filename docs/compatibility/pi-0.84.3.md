# Pi 0.84.3 Compatibility Spike

- Status: **PASS**
- Runtime: `@earendil-works/pi-coding-agent@0.84.3`
- Node.js: `v24.14.1`

This spike validates the Pi APIs required by the [authoritative v0 design](../../DESIGN.md). It does not validate any candidate runtime rule.

## SDK path

A `DefaultResourceLoader` was created with:

- `appendSystemPromptOverride` adding one fixed marker and body;
- extensions, Skills, prompt templates, themes, and context files disabled;
- an isolated Pi agent directory;
- in-memory settings and session state.

After `reload()` and `createAgentSession()`:

- the effective `session.agent.state.systemPrompt` contained exactly one marker;
- zero Skills were loaded;
- zero context files were loaded;
- zero extensions were loaded.

Result: **PASS**.

## CLI path

Two explicit temporary extensions were loaded into Pi print mode:

1. the first injected a fixed marker in `before_agent_start`;
2. the second inspected both `event.systemPrompt` and `ctx.getSystemPrompt()`.

Across two prompts in one process:

- each handler observed exactly one marker;
- `event.systemPrompt` equaled `ctx.getSystemPrompt()`;
- the marker count did not accumulate across turns;
- Pi completed without interaction.

Result: **PASS**.

## Automated offline regression

The test suite starts an isolated OpenAI-compatible loopback server and uses Pi 0.84.3 without a model credential.

It verifies that:

- an SDK session with the Cynos extension as the only injection path sends exactly one marker and exact rule body to the provider;
- the combined SDK `appendSystemPromptOverride` plus effective-prompt guard also sends exactly one block;
- Pi CLI loads an explicit `--extension` while `--no-extensions` disables discovery;
- the CLI provider request contains the extension-added prompt marker;
- stdin is closed and the run completes without interaction.

These checks run in `npm test` and do not use a paid model.

## Source-level confirmation

Pi 0.84.3 exposes:

- `DefaultResourceLoaderOptions.appendSystemPromptOverride`;
- the chained `before_agent_start` system prompt;
- `ctx.getSystemPrompt()` reflecting prior handlers in that chain.

Pi rebuilds each turn from `_baseSystemPrompt`, so a per-turn CLI extension does not accumulate prior-turn text under normal operation.

## Decision

Cynos Rules v0 pins `@earendil-works/pi-coding-agent@0.84.3`. Production tests must reproduce these assertions. Any Pi upgrade requires a new compatibility run and a reviewed update to the authoritative design.
