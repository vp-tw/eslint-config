import type antfu from "@antfu/eslint-config";
import type { ConfigNames as AntfuConfigNames } from "@antfu/eslint-config";
import { combine } from "@antfu/eslint-config";
import { composer } from "eslint-flat-config-utils";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";
import { mdx } from "../src/configs/mdx";
import { prettier } from "../src/configs/prettier";
import { reactCompiler } from "../src/configs/reactCompiler";
import { storybook } from "../src/configs/storybook";
import { imports } from "../src/extends/imports";
import { javascript } from "../src/extends/javascript";
import { jsonc } from "../src/extends/jsonc";

import { react } from "../src/extends/react";
import {
  sortJsonArrayValues,
  sortJsonKeys,
  sortTsconfigJson,
} from "../src/extends/sort";
import { typescript } from "../src/extends/typescript";
import { yaml } from "../src/extends/yaml";

(async () => {
  const pkgDir = await packageDirectory();
  if (!pkgDir) {
    throw new Error("Could not find package directory");
  }
  const distDir = path.join(pkgDir, "src");
  const targetPath = path.join(distDir, "eslint-typegen.d.ts");
  await fs.ensureDir(path.dirname(targetPath));

  const configs = await combine(
    mdx(),
    prettier(),
    reactCompiler(),
    storybook(),
  );

  const extendsConfigs = await (async () => {
    const allAntfuConfigNames = [
      "antfu/astro/setup",
      "antfu/astro/rules",
      "antfu/eslint-comments/rules",
      "antfu/formatter/setup",
      "antfu/imports/rules",
      "antfu/javascript/setup",
      "antfu/javascript/rules",
      "antfu/jsx/setup",
      "antfu/jsdoc/rules",
      "antfu/jsonc/setup",
      "antfu/jsonc/rules",
      "antfu/markdown/setup",
      "antfu/markdown/processor",
      "antfu/markdown/parser",
      "antfu/markdown/disables",
      "antfu/node/rules",
      "antfu/perfectionist/setup",
      "antfu/react/setup",
      "antfu/react/rules",
      "antfu/solid/setup",
      "antfu/solid/rules",
      "antfu/sort/package-json",
      "antfu/stylistic/rules",
      "antfu/svelte/setup",
      "antfu/svelte/rules",
      "antfu/test/setup",
      "antfu/test/rules",
      "antfu/toml/setup",
      "antfu/toml/rules",
      "antfu/regexp/rules",
      "antfu/typescript/setup",
      "antfu/typescript/parser",
      "antfu/typescript/rules",
      "antfu/unicorn/rules",
      "antfu/unocss",
      "antfu/vue/setup",
      "antfu/vue/rules",
      "antfu/yaml/setup",
      "antfu/yaml/rules",
      "antfu/yaml/pnpm-workspace",
    ] satisfies Array<AntfuConfigNames>;
    type RuntimeAntfuConfigNames = (typeof allAntfuConfigNames)[number];
    /**
     * Make sure following type assertions are correct.
     */
    undefined as unknown as RuntimeAntfuConfigNames satisfies AntfuConfigNames;
    undefined as unknown as AntfuConfigNames satisfies RuntimeAntfuConfigNames;
    const stubAntfuConfig: ReturnType<typeof antfu> = (() => {
      let c = composer();
      allAntfuConfigNames.forEach((name) => {
        c = c.append({ name });
      });
      return c;
    })();
    javascript(stubAntfuConfig);
    imports(stubAntfuConfig);
    typescript(stubAntfuConfig);
    jsonc(stubAntfuConfig);
    yaml(stubAntfuConfig);
    react(stubAntfuConfig);
    sortTsconfigJson(stubAntfuConfig);
    sortJsonKeys(stubAntfuConfig);
    sortJsonArrayValues(stubAntfuConfig);
    return stubAntfuConfig;
  })();

  /**
   * Learned from: <https://github.com/antfu/eslint-config/blob/d9b10e1/scripts/typegen.ts>
   */
  const configNames = [...configs, ...extendsConfigs].flatMap((item) =>
    !(item.name && item.name.startsWith("vdustr/")) ? [] : [item.name],
  );
  let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
  });
  dts += `
  // Names of all the configs
  export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
  `;

  await fs.writeFile(targetPath, dts);
})();
