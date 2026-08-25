## Change

- Linked Issue:
- Rule ID, if applicable:
- Change type: rule / adapter / evaluation integration / documentation / maintenance

## Authority

- [ ] This change conforms to `DESIGN.md`, or the PR explicitly proposes a reviewed design change first.
- [ ] A rule change affects exactly one logical Rule ID, or the exception is explained.

## Evidence

For rule changes:

- Observed failure:
- Exact candidate text:
- Fixture results:
- Baseline Harbor job:
- Candidate Harbor job:
- Official evaluator result:
- Token-count change:
- Regressions, over-following, and limitations:

For non-rule changes, describe the deterministic tests that cover the contract.

## Safety and fairness

- [ ] No gold patch, hidden test, historical answer, verifier internals, or credential is included.
- [ ] Paid evaluation, if requested, will run only from a reviewed commit on a trusted runner.
- [ ] Confirmation tasks used for optimization are retired according to `DESIGN.md`.

## Checks

- [ ] `npm run check`
- [ ] English and Chinese documentation are synchronized when applicable.
