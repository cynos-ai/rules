import { RulesManifestError } from "./errors.js";
import {
  DIGEST_ALGORITHM,
  type RulesIdentity,
  type Sha256Digest,
} from "./types.js";

const MARKER_PATTERN = /<!-- cynos-rules package=([^\s]+) version=([^\s]+) ruleset=([^\s]+) digest=(sha256:[0-9a-f]{64}) -->/g;
const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

export interface ParsedRulesMarker {
  raw: string;
  package: string;
  packageVersion: string;
  ruleset: string;
  digest: Sha256Digest;
}

export function assertSha256Digest(value: string): asserts value is Sha256Digest {
  if (!SHA256_PATTERN.test(value)) {
    throw new RulesManifestError(
      `Expected ${DIGEST_ALGORITHM}:<64 lowercase hex characters>, received ${JSON.stringify(value)}`,
    );
  }
}

export function createRulesMarker(identity: RulesIdentity): string {
  assertSha256Digest(identity.digest);
  return `<!-- cynos-rules package=${identity.package} version=${identity.packageVersion} ruleset=${identity.ruleset} digest=${identity.digest} -->`;
}

export function findRulesMarkers(text: string): ParsedRulesMarker[] {
  const markers: ParsedRulesMarker[] = [];
  for (const match of text.matchAll(MARKER_PATTERN)) {
    const [, packageName, packageVersion, ruleset, digest] = match;
    if (
      packageName === undefined ||
      packageVersion === undefined ||
      ruleset === undefined ||
      digest === undefined
    ) {
      continue;
    }
    assertSha256Digest(digest);
    markers.push({
      raw: match[0],
      package: packageName,
      packageVersion,
      ruleset,
      digest,
    });
  }
  return markers;
}
