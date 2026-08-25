import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { getEncoding } from "js-tiktoken";
import type { LoadedRuleset, RulesManifest } from "../../src/contract/types.js";
import { loadRulesetFromDirectory } from "../../src/contract/load.js";
import { createRulesMarker } from "../../src/contract/marker.js";

export interface FixtureRule {
  id: string;
  fileName: string;
  content: string | Buffer;
}

export interface RulesFixture {
  root: string;
  manifest: RulesManifest;
  ruleset: LoadedRuleset;
}

export function createRulesFixture(
  rules: FixtureRule[] = [
    {
      id: "CR-TEST-001",
      fileName: "CR-TEST-001.md",
      content: "[CR-TEST-001] When evidence is absent, do not claim success.\n",
    },
  ],
): RulesFixture {
  const root = mkdtempSync(resolve(tmpdir(), "cynos-rules-test-"));
  mkdirSync(resolve(root, "rules/core"), { recursive: true });
  writeFileSync(
    resolve(root, "package.json"),
    `${JSON.stringify({ name: "@cynos-ai/rules", version: "0.0.0" }, null, 2)}\n`,
  );
  const bodyParts: Buffer[] = [];
  const entries = rules.map((rule) => {
    const bytes = Buffer.isBuffer(rule.content) ? rule.content : Buffer.from(rule.content, "utf8");
    writeFileSync(resolve(root, "rules/core", rule.fileName), bytes);
    bodyParts.push(bytes);
    return { id: rule.id, path: `rules/core/${rule.fileName}` };
  });
  const digest = `sha256:${createHash("sha256").update(Buffer.concat(bodyParts)).digest("hex")}` as const;
  const identity = {
    package: "@cynos-ai/rules",
    packageVersion: "0.0.0",
    ruleset: "core",
    digest,
  } as const;
  const injectedBlock = `${createRulesMarker(identity)}\n${Buffer.concat(bodyParts).toString("utf8")}`;
  const tokenCount = getEncoding("o200k_base").encode(injectedBlock).length;
  const manifest: RulesManifest = {
    schemaVersion: 1,
    package: "@cynos-ai/rules",
    packageVersion: "0.0.0",
    ruleset: "core",
    piVersion: "0.84.3",
    digestAlgorithm: "sha256",
    digest,
    tokenCount,
    rules: entries,
  };
  writeFileSync(
    resolve(root, "rules/manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return { root, manifest, ruleset: loadRulesetFromDirectory(root) };
}
