# Security Policy

## Supported versions

Cynos Rules has not published a supported runtime release yet. This section will list supported versions beginning with `0.1.0`.

## Reporting a vulnerability

Do not open a public Issue for a suspected vulnerability. Use the repository's private GitHub Security Advisory form:

```text
https://github.com/cynos-ai/rules/security/advisories/new
```

Include the affected commit or version, impact, reproduction steps, and any proposed mitigation. Do not include real model credentials, private repository content, hidden benchmark tests, or unrelated personal data.

## Scope

Relevant reports include:

- package or adapter behavior that exposes credentials or mutable host resources;
- failure of ruleset identity, digest, duplicate, or conflict detection;
- unintended loading of Skills, extensions, prompts, or context in an isolated profile;
- benchmark answer leakage to the agent;
- unsafe Harbor mount or artifact-redaction behavior.

Prompt guidance not reliably controlling model behavior is not by itself a security vulnerability. Cynos Rules does not claim that prompt text enforces permissions or sandbox boundaries.
