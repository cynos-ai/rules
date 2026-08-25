export const PACKAGE_NAME = "@cynos-ai/rules" as const;
export const RULESET_ID = "core" as const;
export const DIGEST_ALGORITHM = "sha256" as const;
export const SUPPORTED_PI_VERSION = "0.84.3" as const;
export const MAX_INJECTED_TOKENS = 400 as const;

export type Sha256Digest = `sha256:${string}`;

export interface RuleManifestEntry {
  id: string;
  path: string;
}

export interface RulesManifest {
  schemaVersion: 1;
  package: typeof PACKAGE_NAME;
  packageVersion: string;
  ruleset: typeof RULESET_ID;
  piVersion: typeof SUPPORTED_PI_VERSION;
  digestAlgorithm: typeof DIGEST_ALGORITHM;
  digest: Sha256Digest;
  tokenCount: number;
  rules: RuleManifestEntry[];
}

export interface RulesIdentity {
  package: typeof PACKAGE_NAME;
  packageVersion: string;
  ruleset: typeof RULESET_ID;
  digest: Sha256Digest;
}

export interface LoadedRuleset {
  manifest: RulesManifest;
  identity: RulesIdentity;
  body: string;
  bodyBytes: Uint8Array;
  marker: string;
  injectedBlock: string;
}

export type InjectionStatus = "injected" | "already-present";
