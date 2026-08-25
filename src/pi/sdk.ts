import { type DefaultResourceLoader } from "@earendil-works/pi-coding-agent";
import { loadBundledRuleset } from "../contract/load.js";
import {
  createPiRulesResourceLoader,
  type InternalResourceLoaderOptions,
} from "./internal.js";

export type CynosRulesResourceLoaderOptions = InternalResourceLoaderOptions;

export function createCynosRulesResourceLoader(
  options: CynosRulesResourceLoaderOptions,
): DefaultResourceLoader {
  return createPiRulesResourceLoader(options, loadBundledRuleset());
}
