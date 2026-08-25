import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { loadBundledRuleset } from "../contract/load.js";
import { createPiRulesExtension } from "./internal.js";

export default function cynosRulesPiExtension(pi: ExtensionAPI): void {
  createPiRulesExtension(loadBundledRuleset())(pi);
}
