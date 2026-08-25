import { createHash } from "node:crypto";
import {
  readFileSync,
  realpathSync,
} from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { RulesDigestError, RulesManifestError } from "./errors.js";
import { createRulesMarker, assertSha256Digest } from "./marker.js";
import {
  DIGEST_ALGORITHM,
  MAX_INJECTED_TOKENS,
  PACKAGE_NAME,
  RULESET_ID,
  SUPPORTED_PI_VERSION,
  type LoadedRuleset,
  type RuleManifestEntry,
  type RulesManifest,
} from "./types.js";

const RULE_ID_PATTERN = /^CR-[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-[0-9]{3}$/;
const MANIFEST_KEYS = [
  "schemaVersion",
  "package",
  "packageVersion",
  "ruleset",
  "piVersion",
  "digestAlgorithm",
  "digest",
  "tokenCount",
  "rules",
] as const;
const RULE_KEYS = ["id", "path"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  label: string,
): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new RulesManifestError(
      `${label} keys must be exactly ${wanted.join(", ")}; received ${actual.join(", ")}`,
    );
  }
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new RulesManifestError(`${label} must be a non-empty string`);
  }
}

function parseRuleEntry(value: unknown, index: number): RuleManifestEntry {
  if (!isRecord(value)) {
    throw new RulesManifestError(`rules[${index}] must be an object`);
  }
  assertExactKeys(value, RULE_KEYS, `rules[${index}]`);
  assertNonEmptyString(value.id, `rules[${index}].id`);
  assertNonEmptyString(value.path, `rules[${index}].path`);
  if (!RULE_ID_PATTERN.test(value.id)) {
    throw new RulesManifestError(`rules[${index}].id is not a stable Cynos Rule ID: ${value.id}`);
  }
  const expectedPath = `rules/core/${value.id}.md`;
  if (value.path !== expectedPath || value.path.includes("\\") || isAbsolute(value.path)) {
    throw new RulesManifestError(
      `rules[${index}].path must be exactly ${expectedPath}`,
    );
  }
  return { id: value.id, path: value.path };
}

function parseManifest(value: unknown): RulesManifest {
  if (!isRecord(value)) {
    throw new RulesManifestError("rules/manifest.json must contain an object");
  }
  assertExactKeys(value, MANIFEST_KEYS, "manifest");
  if (value.schemaVersion !== 1) {
    throw new RulesManifestError("manifest.schemaVersion must be 1");
  }
  if (value.package !== PACKAGE_NAME) {
    throw new RulesManifestError(`manifest.package must be ${PACKAGE_NAME}`);
  }
  assertNonEmptyString(value.packageVersion, "manifest.packageVersion");
  if (value.ruleset !== RULESET_ID) {
    throw new RulesManifestError(`manifest.ruleset must be ${RULESET_ID}`);
  }
  if (value.piVersion !== SUPPORTED_PI_VERSION) {
    throw new RulesManifestError(`manifest.piVersion must be ${SUPPORTED_PI_VERSION}`);
  }
  if (value.digestAlgorithm !== DIGEST_ALGORITHM) {
    throw new RulesManifestError(`manifest.digestAlgorithm must be ${DIGEST_ALGORITHM}`);
  }
  assertNonEmptyString(value.digest, "manifest.digest");
  assertSha256Digest(value.digest);
  if (!Number.isInteger(value.tokenCount) || (value.tokenCount as number) < 1) {
    throw new RulesManifestError("manifest.tokenCount must be a positive integer");
  }
  if ((value.tokenCount as number) > MAX_INJECTED_TOKENS) {
    throw new RulesManifestError(
      `manifest.tokenCount exceeds the v0 limit of ${MAX_INJECTED_TOKENS}`,
    );
  }
  if (!Array.isArray(value.rules) || value.rules.length === 0) {
    throw new RulesManifestError("manifest.rules must contain at least one accepted rule");
  }
  const rules = value.rules.map(parseRuleEntry);
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const rule of rules) {
    if (ids.has(rule.id)) throw new RulesManifestError(`Duplicate Rule ID: ${rule.id}`);
    if (paths.has(rule.path)) throw new RulesManifestError(`Duplicate rule path: ${rule.path}`);
    ids.add(rule.id);
    paths.add(rule.path);
  }
  return {
    schemaVersion: 1,
    package: PACKAGE_NAME,
    packageVersion: value.packageVersion,
    ruleset: RULESET_ID,
    piVersion: SUPPORTED_PI_VERSION,
    digestAlgorithm: DIGEST_ALGORITHM,
    digest: value.digest,
    tokenCount: value.tokenCount as number,
    rules,
  };
}

function readValidatedRuleBytes(packageRoot: string, entry: RuleManifestEntry): Buffer {
  const absolute = resolve(packageRoot, entry.path);
  const relativePath = relative(packageRoot, absolute);
  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new RulesManifestError(`Rule path escapes the package root: ${entry.path}`);
  }
  const realRoot = realpathSync(packageRoot);
  const realFile = realpathSync(absolute);
  if (realFile !== realRoot && !realFile.startsWith(`${realRoot}${sep}`)) {
    throw new RulesManifestError(`Rule symlink escapes the package root: ${entry.path}`);
  }
  const bytes = readFileSync(realFile);
  if (bytes.length === 0) throw new RulesManifestError(`Rule file is empty: ${entry.path}`);
  if (bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
    throw new RulesManifestError(`Rule file must not contain a UTF-8 BOM: ${entry.path}`);
  }
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new RulesManifestError(`Rule file is not valid UTF-8: ${entry.path}`);
  }
  if (bytes.includes(0x0d)) {
    throw new RulesManifestError(`Rule file must use LF and contain no CR bytes: ${entry.path}`);
  }
  if (bytes.at(-1) !== 0x0a || bytes.at(-2) === 0x0a) {
    throw new RulesManifestError(`Rule file must end with exactly one LF byte: ${entry.path}`);
  }
  return bytes;
}

export function loadRulesetFromDirectory(packageRoot: string): LoadedRuleset {
  const root = realpathSync(packageRoot);
  const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as unknown;
  if (!isRecord(packageJson)) throw new RulesManifestError("package.json must contain an object");
  if (packageJson.name !== PACKAGE_NAME) {
    throw new RulesManifestError(`package.json name must be ${PACKAGE_NAME}`);
  }
  assertNonEmptyString(packageJson.version, "package.json version");

  const manifestValue = JSON.parse(
    readFileSync(resolve(root, "rules/manifest.json"), "utf8"),
  ) as unknown;
  const manifest = parseManifest(manifestValue);
  if (manifest.packageVersion !== packageJson.version) {
    throw new RulesManifestError(
      `Manifest packageVersion ${manifest.packageVersion} does not match package.json ${packageJson.version}`,
    );
  }

  const bodyBytes = Buffer.concat(
    manifest.rules.map((entry) => readValidatedRuleBytes(root, entry)),
  );
  const actualDigest = `sha256:${createHash("sha256").update(bodyBytes).digest("hex")}` as const;
  if (actualDigest !== manifest.digest) {
    throw new RulesDigestError(
      `Rules digest mismatch: manifest=${manifest.digest}, actual=${actualDigest}`,
    );
  }
  const body = new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes);
  const identity = {
    package: PACKAGE_NAME,
    packageVersion: manifest.packageVersion,
    ruleset: RULESET_ID,
    digest: manifest.digest,
  } as const;
  const marker = createRulesMarker(identity);
  return {
    manifest,
    identity,
    body,
    bodyBytes,
    marker,
    injectedBlock: `${marker}\n${body}`,
  };
}

export function getBundledPackageRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../..");
}

export function loadBundledRuleset(): LoadedRuleset {
  return loadRulesetFromDirectory(getBundledPackageRoot());
}
