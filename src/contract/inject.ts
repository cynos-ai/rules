import { RulesConflictError } from "./errors.js";
import { findRulesMarkers } from "./marker.js";
import type { InjectionStatus, LoadedRuleset } from "./types.js";

const MARKER_FRAGMENT_PATTERN = /<!-- cynos-rules[^>]*-->/g;

export interface SystemPromptInjectionResult {
  status: InjectionStatus;
  systemPrompt: string;
}

export interface AppendPromptInjectionResult {
  status: InjectionStatus;
  appendSystemPrompt: string[];
}

function assertCompatibleMarkers(texts: readonly string[], ruleset: LoadedRuleset): InjectionStatus | undefined {
  const prefixCount = texts.reduce(
    (count, text) => count + text.split("<!-- cynos-rules").length - 1,
    0,
  );
  const fragments = texts.flatMap((text) => text.match(MARKER_FRAGMENT_PATTERN) ?? []);
  const markers = texts.flatMap((text) => findRulesMarkers(text));
  if (prefixCount !== fragments.length || fragments.length !== markers.length) {
    throw new RulesConflictError(
      "Found a malformed Cynos Rules marker; refusing to inject another ruleset",
      fragments,
    );
  }
  if (markers.length === 0) return undefined;
  if (markers.length === 1 && markers[0]?.raw === ruleset.marker) {
    const blockCount = texts.reduce(
      (count, text) => count + text.split(ruleset.injectedBlock).length - 1,
      0,
    );
    if (blockCount === 1) return "already-present";
    throw new RulesConflictError(
      "Found the expected Cynos Rules marker without exactly one matching rule body",
      markers.map((marker) => marker.raw),
    );
  }
  throw new RulesConflictError(
    `Cynos Rules identity conflict: expected ${ruleset.marker}`,
    markers.map((marker) => marker.raw),
  );
}

export function injectIntoSystemPrompt(
  systemPrompt: string,
  ruleset: LoadedRuleset,
): SystemPromptInjectionResult {
  const status = assertCompatibleMarkers([systemPrompt], ruleset);
  if (status === "already-present") return { status, systemPrompt };
  return {
    status: "injected",
    systemPrompt: systemPrompt.length === 0
      ? ruleset.injectedBlock
      : `${systemPrompt}\n\n${ruleset.injectedBlock}`,
  };
}

export function injectIntoAppendSystemPrompt(
  appendSystemPrompt: readonly string[],
  ruleset: LoadedRuleset,
): AppendPromptInjectionResult {
  const status = assertCompatibleMarkers(appendSystemPrompt, ruleset);
  if (status === "already-present") {
    return { status, appendSystemPrompt: [...appendSystemPrompt] };
  }
  return {
    status: "injected",
    appendSystemPrompt: [...appendSystemPrompt, ruleset.injectedBlock],
  };
}
