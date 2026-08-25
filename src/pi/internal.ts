import {
  DefaultResourceLoader,
  type ExtensionAPI,
  type ExtensionFactory,
  type InlineExtension,
} from "@earendil-works/pi-coding-agent";
import {
  injectIntoAppendSystemPrompt,
  injectIntoSystemPrompt,
} from "../contract/inject.js";
import type { LoadedRuleset } from "../contract/types.js";

export function createPiRulesExtension(ruleset: LoadedRuleset): ExtensionFactory {
  return (pi: ExtensionAPI) => {
    pi.on("before_agent_start", (event) => {
      const result = injectIntoSystemPrompt(event.systemPrompt, ruleset);
      if (result.status === "already-present") return;
      return { systemPrompt: result.systemPrompt };
    });
  };
}

type DefaultResourceLoaderOptions = ConstructorParameters<typeof DefaultResourceLoader>[0];
export type InternalResourceLoaderOptions = Omit<
  DefaultResourceLoaderOptions,
  "appendSystemPromptOverride"
>;

export function createPiRulesResourceLoader(
  options: InternalResourceLoaderOptions,
  ruleset: LoadedRuleset,
): DefaultResourceLoader {
  const {
    agentsFilesOverride,
    extensionFactories = [],
    systemPromptOverride,
    ...baseOptions
  } = options;
  // Pi 0.84.3 reloads agents files and the custom system prompt before append
  // prompts. Compatibility tests pin this ordering because append injection uses
  // the effective earlier resources for duplicate/conflict detection.
  let effectiveSystemPrompt: string | undefined;
  let effectiveContextFiles: string[] = [];
  const guard: InlineExtension = {
    name: "cynos-rules",
    factory: createPiRulesExtension(ruleset),
  };
  return new DefaultResourceLoader({
    ...baseOptions,
    extensionFactories: [...extensionFactories, guard],
    agentsFilesOverride: (base) => {
      const effective = agentsFilesOverride ? agentsFilesOverride(base) : base;
      effectiveContextFiles = effective.agentsFiles.map((file) => file.content);
      return effective;
    },
    systemPromptOverride: (base) => {
      effectiveSystemPrompt = systemPromptOverride ? systemPromptOverride(base) : base;
      return effectiveSystemPrompt;
    },
    appendSystemPromptOverride: (base) => {
      const existing = [effectiveSystemPrompt ?? "", ...effectiveContextFiles, ...base]
        .filter((value) => value.length > 0)
        .join("\n\n");
      const probe = injectIntoSystemPrompt(existing, ruleset);
      return probe.status === "already-present"
        ? [...base]
        : injectIntoAppendSystemPrompt(base, ruleset).appendSystemPrompt;
    },
  });
}
