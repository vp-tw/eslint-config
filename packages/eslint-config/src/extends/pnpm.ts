import type { ConfigOverrides, VpComposer } from "../types";
import { omit, pick } from "es-toolkit";
import { GLOB_PNPM_WORKSPACE_YAML } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

namespace pnpm {
  export interface Options {
    pnpm?: ConfigOverrides;
  }
}

const pnpm = (composer: VpComposer, options?: pnpm.Options) => {
  extendsConfig(composer, "antfu/pnpm/pnpm-workspace-yaml-sort", (config) => {
    const modifiedConfig = mergeConfig(pick(options?.pnpm ?? {}, ["files", "ignores"]), {
      ...config,
      files: [GLOB_PNPM_WORKSPACE_YAML],
    });
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const sortKeysConfig = mergeConfig(options?.pnpm, {
      ...omittedConfig,
      name: "vdustr/pnpm/pnpm-workspace-yaml-sort",
      rules: {
        "yaml/sort-keys": [
          "error",
          {
            pathPattern: ".*",
            order: {
              type: "asc",
              caseSensitive: false,
              natural: true,
            },
          },
        ],
      },
    });
    return [config, sortKeysConfig];
  });
};

export { pnpm };
