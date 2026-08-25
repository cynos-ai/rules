# Contributing to Cynos Rules

Thank you for helping keep Cynos Rules small, testable, and useful.

Read the [authoritative design](DESIGN.md) and [rule philosophy](docs/philosophy.md) before proposing a change. The design is normative for v0.

## Local checks

Requirements:

- Node.js `24.14.1` or a compatible Node release satisfying `>=22.19.0`;
- npm;
- no model credential for offline checks.

```bash
npm ci --ignore-scripts
npm run check
npm run build
```

The repository pins `@earendil-works/pi-coding-agent@0.84.3` for v0 compatibility tests.

## Rule changes

Open a **Rule Proposal** Issue before submitting a rule Pull Request. A proposal must begin with a real or reproducible failure and normally covers one Rule ID.

A rule Pull Request must include:

- exact English runtime text;
- positive, near-neighbor, conflict, and over-following fixtures;
- manifest, digest, and token-count updates;
- pre-registered evaluation evidence;
- known regressions and limitations;
- a linked Proposal Issue.

Unvalidated rules do not enter `rules/core/` or the default manifest. Automation never accepts a rule by itself; maintainers decide through review.

## Evaluation findings

Record campaign observations with the **Evaluation Finding** Issue template. Findings are facts, not automatic rule proposals. Classify host, model, infrastructure, benchmark, and deterministic-tool defects before proposing more prompt text.

Paid benchmark jobs run only after explicit maintainer approval from a reviewed commit on a trusted runner. Never expose model credentials to untrusted Pull Request code.

## Documentation

English is authoritative. Every substantive English document requires an article-for-article Chinese translation:

- root `NAME.md` → `NAME.zh-CN.md`;
- `docs/path/NAME.md` → `docs/zh-CN/path/NAME.md`.

The first line of each Chinese document records the SHA-256 digest of its English source:

```text
<!-- source-sha256:<64 lowercase hex characters> -->
```

After updating the English source and its translation, update this marker and run `npm run check:docs`.

## Pull requests

Keep changes narrow. Do not combine independent rules, adapter redesigns, benchmark changes, and unrelated cleanup. If a change alters a normative product boundary, update `DESIGN.md` and its translation through explicit review before relying on the new behavior.
