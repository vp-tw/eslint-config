import type { ConfigOverrides, Rules, VpComposer } from "../types";
import { GLOB_MARKDOWN_CODE, interopDefault } from "@antfu/eslint-config";
import { omit, pick } from "es-toolkit";
import { reactCompiler } from "../configs/reactCompiler";
import { GLOB_MDX_CODE } from "../globs";
import { eslintReact as importEslintReact } from "../lib/eslint-react";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

namespace react {
  export interface Options {
    react?: ConfigOverrides;
    reactCompiler?: reactCompiler.Options["reactCompiler"];
    reactCompilerSetup?: reactCompiler.Options["setup"];
    md?: ConfigOverrides;
    typescript?: boolean;
  }
}

/**
 * https://github.com/antfu/eslint-config/blob/2e0294d/src/configs/react.ts#L79-L87
 */
const reactRulesRenameMap = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",
  "@eslint-react/web-api": "react-web-api",
};

/**
 * Custom rename function for React rules.
 * Using antfu's renameRules causes @eslint-react to always match first,
 * resulting in sub-namespaces being renamed incorrectly
 * (e.g., @eslint-react/dom becomes react/dom instead of react-dom).
 */
function renameReactRules(rules: Partial<Rules>) {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      const namespaceArray = key.split("/");
      // remove last one
      const namespace = namespaceArray.slice(0, -1).join("/");
      if (namespace in reactRulesRenameMap) {
        const newNamespace = reactRulesRenameMap[namespace as keyof typeof reactRulesRenameMap];
        if (newNamespace) {
          const newKey = key.replace(namespace, newNamespace);
          return [newKey, value];
        }
      }
      return [key, value];
    }),
  );
}

const react = (composer: VpComposer, options?: react.Options) => {
  const typescriptEnabled: boolean = options?.typescript ?? true;
  // antfu's `antfu/react/setup` expects sub-plugin keys that no longer exist in
  // `@eslint-react` v4 (dom, naming-convention, rsc, web-api are all merged
  // into the root `@eslint-react` plugin). Passing `undefined` plugins would
  // fail ESLint's config validation.
  extendsConfig(composer, "antfu/react/setup", async (config) => {
    const eslintReact = await importEslintReact();
    const reactPlugin = eslintReact.configs.all.plugins?.["@eslint-react"];
    const reactRefresh = await interopDefault(import("eslint-plugin-react-refresh"));
    return {
      ...config,
      plugins: {
        react: reactPlugin,
        "react-refresh": reactRefresh,
      },
    };
  });
  extendsConfig(composer, "antfu/react/rules", async (config) => {
    const eslintReact = await importEslintReact();
    const modifiedConfig = mergeConfig(pick(options?.react ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const baseConfig = typescriptEnabled
      ? eslintReact.configs["strict-typescript"]
      : eslintReact.configs.strict;
    const rulesConfig = mergeConfig(
      omit(options?.react ?? {}, ["files", "ignores"]),
      {
        // plugins already setup by antfu
        ...omit(baseConfig, ["plugins"]),
        name: "vdustr/react/rules",
        rules: renameReactRules({
          ...baseConfig.rules,
          "react/prefer-destructuring-assignment": "off",
        }),
      },
      omittedConfig,
    );
    const reactCompilerConfigs = await reactCompiler({
      setup: options?.reactCompilerSetup ?? {},
      reactCompiler: mergeConfig(options?.reactCompiler, pick(omittedConfig, ["files", "ignores"])),
    });
    /**
     * Disable rules not suitable for MD / MDX files.
     */
    const mdConfig = mergeConfig(
      {
        ...(options?.md ?? {}),
      },
      {
        ...modifiedConfig,
        name: "vdustr/react/md/rules",
        files: [GLOB_MARKDOWN_CODE, GLOB_MDX_CODE],
        rules: {
          "react-compiler/react-compiler": "off",
          "react/rules-of-hooks": "off",
          "react-refresh/only-export-components": "off",
        },
      },
    );
    return [modifiedConfig, rulesConfig, ...reactCompilerConfigs, mdConfig];
  });
};

export { react };
