import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import test, { type TestContext } from "node:test";
import { RulesConflictError } from "../src/contract/errors.js";
import {
  injectIntoAppendSystemPrompt,
  injectIntoSystemPrompt,
} from "../src/contract/inject.js";
import { createRulesFixture } from "./helpers/fixture.js";

function cleanup(t: TestContext, ...roots: string[]): void {
  t.after(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));
}

test("injects once and skips an identical effective identity", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const first = injectIntoSystemPrompt("Base prompt.", fixture.ruleset);
  assert.equal(first.status, "injected");
  assert.equal(first.systemPrompt, `Base prompt.\n\n${fixture.ruleset.injectedBlock}`);

  const second = injectIntoSystemPrompt(first.systemPrompt, fixture.ruleset);
  assert.equal(second.status, "already-present");
  assert.equal(second.systemPrompt, first.systemPrompt);
});

test("rejects a different digest and duplicate markers", (t) => {
  const first = createRulesFixture();
  const second = createRulesFixture([
    { id: "CR-OTHER-001", fileName: "CR-OTHER-001.md", content: "Different rule.\n" },
  ]);
  cleanup(t, first.root, second.root);
  const existing = injectIntoSystemPrompt("Base", first.ruleset).systemPrompt;
  assert.throws(
    () => injectIntoSystemPrompt(existing, second.ruleset),
    RulesConflictError,
  );
  assert.throws(
    () => injectIntoSystemPrompt(`${existing}\n${first.ruleset.marker}`, first.ruleset),
    /identity conflict/,
  );
});

test("rejects malformed markers and markers without the exact body", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  assert.throws(
    () => injectIntoSystemPrompt("<!-- cynos-rules digest=broken -->", fixture.ruleset),
    /malformed Cynos Rules marker/,
  );
  assert.throws(
    () => injectIntoSystemPrompt("<!-- cynos-rules digest=broken", fixture.ruleset),
    /malformed Cynos Rules marker/,
  );
  assert.throws(
    () => injectIntoSystemPrompt(fixture.ruleset.marker, fixture.ruleset),
    /without exactly one matching rule body/,
  );
});

test("injects as one append-system-prompt entry without modifying existing entries", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const base = ["First append.", "Second append."];
  const first = injectIntoAppendSystemPrompt(base, fixture.ruleset);
  assert.equal(first.status, "injected");
  assert.deepEqual(first.appendSystemPrompt, [...base, fixture.ruleset.injectedBlock]);
  assert.deepEqual(base, ["First append.", "Second append."]);

  const second = injectIntoAppendSystemPrompt(first.appendSystemPrompt, fixture.ruleset);
  assert.equal(second.status, "already-present");
  assert.deepEqual(second.appendSystemPrompt, first.appendSystemPrompt);
});
