# Cynos Rules

Evidence-tested judgment rules for coding agents.

> **Teach judgment, not recipes. Test every rule.**

Cynos Rules is currently design-first and unreleased. Version `0.1.0` will be published only after at least one proposed rule passes the documented evidence gates.

## Current scope

- one small, fixed `core` ruleset;
- deterministic injection into Pi through SDK and CLI adapters;
- a thin Harbor integration for paired Vanilla Pi versus Pi + Cynos Rules evaluation;
- GitHub Issues and Pull Requests for proposing and reviewing rule changes.

Cynos Rules does not manage `AGENTS.md`, ship Skills, implement an evaluation platform, or claim prompt enforcement.

## Authority

Read the [v0 authoritative design](DESIGN.md) before implementing or reviewing changes. The [Chinese translation](DESIGN.zh-CN.md) is provided for readers; the English document is canonical.

- [Rule philosophy](docs/philosophy.md)
- [Evaluation guide](docs/evaluation.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Pi 0.84.3 compatibility evidence](docs/compatibility/pi-0.84.3.md)

## Status

The rules contract, Pi adapters, offline Pi 0.84.3 regression tests, and Harbor integration scaffold are implemented. No runtime rule has been accepted and no paid benchmark result is claimed. Installation instructions will be added only after the first accepted rule and `0.1.0` release.

## License

[MIT](LICENSE)
