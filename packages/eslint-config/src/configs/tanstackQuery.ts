import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { pick } from "es-toolkit";
import { mergeConfig } from "../utils/mergeConfig";

namespace tanstackQuery {
  export interface Options {
    tanstackQuery?: ConfigOverrides;
  }
}

const tanstackQuery = async (options?: tanstackQuery.Options) => {
  await ensurePackages(["@tanstack/eslint-plugin-query"]);
  const tanstackQueryPlugin = await interopDefault(import("@tanstack/eslint-plugin-query"));
  const recommendedConfigs = tanstackQueryPlugin.configs["flat/recommended"];
  const setupConfig = recommendedConfigs[0];
  if (!setupConfig)
    throw new Error("Failed to load @tanstack/eslint-plugin-query recommended config.");
  const tanstackQuerySetupConfig: TypedFlatConfigItem = {
    ...pick(setupConfig, ["plugins"]),
    name: "vdustr/tanstack-query/setup",
  };
  const tanstackQueryRulesConfig = mergeConfig(options?.tanstackQuery, {
    ...setupConfig,
    name: "vdustr/tanstack-query/rules",
  });
  return [tanstackQuerySetupConfig, tanstackQueryRulesConfig];
};

export { tanstackQuery };
