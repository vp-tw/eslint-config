import type { Linter } from "eslint";
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
  const tanstackQueryPlugin = await interopDefault(
    import("@tanstack/eslint-plugin-query"),
  );
  const recommended = tanstackQueryPlugin.configs[
    "flat/recommended"
  ] satisfies Array<Linter.Config<Linter.RulesRecord>> as [
    Linter.Config<Linter.RulesRecord>,
  ];
  const tanstackQuerySetupConfig: TypedFlatConfigItem = {
    ...pick(recommended[0], ["plugins"]),
    name: "vdustr/tanstack-query/setup",
  };
  const tanstackQueryRulesConfig = mergeConfig(options?.tanstackQuery, {
    ...recommended[0],
    name: "vdustr/tanstack-query/rules",
  });
  return [tanstackQuerySetupConfig, tanstackQueryRulesConfig];
};

export { tanstackQuery };
