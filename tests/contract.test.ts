import assert from "node:assert/strict";
import { readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { getEncoding } from "js-tiktoken";
import { RulesDigestError, RulesManifestError } from "../src/contract/errors.js";
import { loadRulesetFromDirectory } from "../src/contract/load.js";
import { createRulesFixture } from "./helpers/fixture.js";

function cleanup(t: TestContext, root: string): void {
  t.after(() => rmSync(root, { recursive: true, force: true }));
}

test("loads ordered raw rule bytes and constructs a deterministic block", (t) => {
  const fixture = createRulesFixture([
    { id: "CR-ALPHA-001", fileName: "CR-ALPHA-001.md", content: "Alpha rule.\n" },
    { id: "CR-BETA-001", fileName: "CR-BETA-001.md", content: "Beta rule.\n" },
  ]);
  cleanup(t, fixture.root);
  assert.equal(fixture.ruleset.body, "Alpha rule.\nBeta rule.\n");
  assert.equal(
    fixture.ruleset.injectedBlock,
    `${fixture.ruleset.marker}\nAlpha rule.\nBeta rule.\n`,
  );
  assert.equal(fixture.ruleset.identity.digest, fixture.manifest.digest);
  assert.equal(
    getEncoding("o200k_base").encode(fixture.ruleset.injectedBlock).length,
    fixture.manifest.tokenCount,
  );
});

test("rejects a digest mismatch", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const rulePath = resolve(fixture.root, fixture.manifest.rules[0]!.path);
  writeFileSync(rulePath, "Changed after manifest generation.\n");
  assert.throws(() => loadRulesetFromDirectory(fixture.root), RulesDigestError);
});

test("rejects CRLF and more than one terminal LF", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const rulePath = resolve(fixture.root, fixture.manifest.rules[0]!.path);
  writeFileSync(rulePath, "CRLF rule.\r\n");
  assert.throws(
    () => loadRulesetFromDirectory(fixture.root),
    /must use LF and contain no CR bytes/,
  );
  writeFileSync(rulePath, "Two newlines.\n\n");
  assert.throws(
    () => loadRulesetFromDirectory(fixture.root),
    /must end with exactly one LF byte/,
  );
});

test("rejects UTF-8 BOM and invalid UTF-8", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const rulePath = resolve(fixture.root, fixture.manifest.rules[0]!.path);
  writeFileSync(rulePath, Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from("Rule.\n")]));
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /must not contain a UTF-8 BOM/);
  writeFileSync(rulePath, Buffer.from([0xc3, 0x28, 0x0a]));
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /is not valid UTF-8/);
});

test("rejects path traversal and unknown manifest fields", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const manifestPath = resolve(fixture.root, "rules/manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
  const rules = manifest.rules as Array<Record<string, unknown>>;
  rules[0]!.path = "rules/core/../outside.md";
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(() => loadRulesetFromDirectory(fixture.root), RulesManifestError);

  rules[0]!.path = "rules/core/CR-TEST-001.md";
  manifest.unexpected = true;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /manifest keys must be exactly/);
});

test("rejects a rule symlink that escapes the package root", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const rulePath = resolve(fixture.root, fixture.manifest.rules[0]!.path);
  const outside = `${fixture.root}-outside.md`;
  t.after(() => rmSync(outside, { force: true }));
  writeFileSync(outside, readFileSync(rulePath));
  rmSync(rulePath);
  symlinkSync(outside, rulePath);
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /symlink escapes/);
});

test("requires at least one accepted rule and a matching package version", (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  const manifestPath = resolve(fixture.root, "rules/manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
  manifest.rules = [];
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /at least one accepted rule/);

  manifest.rules = fixture.manifest.rules;
  manifest.packageVersion = "0.1.0";
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(() => loadRulesetFromDirectory(fixture.root), /does not match package.json/);
});
