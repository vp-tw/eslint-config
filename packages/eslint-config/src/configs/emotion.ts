import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { mergeConfig } from "../utils/mergeConfig";

namespace emotion {
  export interface Options {
    emotion?: ConfigOverrides;
  }
}

const emotion = async (options?: emotion.Options) => {
  await ensurePackages(["@emotion/eslint-plugin"]);
  const emotionPlugin = await interopDefault(import("@emotion/eslint-plugin"));
  const emotionSetupConfig: TypedFlatConfigItem = {
    plugins: {
      "@emotion": emotionPlugin,
    },
    name: "vdustr/emotion/setup",
  };
  const emotionRulesConfig = mergeConfig(options?.emotion, {
    rules: {
      "@emotion/syntax-preference": [2, "object"],
    },
    name: "vdustr/emotion/rules",
  });
  return [emotionSetupConfig, emotionRulesConfig];
};

export { emotion };
