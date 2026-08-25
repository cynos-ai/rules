import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getEncoding } from "js-tiktoken";
import { loadRulesetFromDirectory } from "../src/contract/load.js";
import { MAX_INJECTED_TOKENS } from "../src/contract/types.js";

const root = resolve(import.meta.dirname, "..");
const manifestPath = resolve(root, "rules/manifest.json");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
  private?: boolean;
  version?: string;
};

if (!existsSync(manifestPath)) {
  if (packageJson.private === true && packageJson.version === "0.0.0") {
    console.log("No accepted runtime rules yet; unreleased private scaffold is valid.");
    process.exit(0);
  }
  throw new Error("rules/manifest.json is required for a publishable package");
}

const ruleset = loadRulesetFromDirectory(root);
const encoding = getEncoding("o200k_base");
const actualTokenCount = encoding.encode(ruleset.injectedBlock).length;
if (actualTokenCount !== ruleset.manifest.tokenCount) {
  throw new Error(
    `Manifest tokenCount mismatch: manifest=${ruleset.manifest.tokenCount}, actual=${actualTokenCount}`,
  );
}
if (actualTokenCount > MAX_INJECTED_TOKENS) {
  throw new Error(`Injected block exceeds ${MAX_INJECTED_TOKENS} o200k_base tokens`);
}
console.log(
  `Rules contract valid: ${ruleset.manifest.rules.length} rule(s), ${actualTokenCount} tokens, ${ruleset.identity.digest}`,
);
