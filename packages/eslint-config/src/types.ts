import type antfu from "@antfu/eslint-config";
import type {
  ConfigNames as AntfuEslintConfigNames,
  Rules as AntfuEslintRules,
} from "@antfu/eslint-config";
import type { DistributiveOmit, Overwrite } from "@mui/types";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type { RuleOptions, ConfigNames as VpEslintConfigNames } from "./eslint-typegen";

// Merge the project-generated rule keys into antfu's `RuleOptions` so every
// `overrides?: Rules` field in antfu's option tree accepts the rule names
// this config contributes (`react/dom-*`, `@emotion/*`, `@tanstack/query/*`,
// `mdx/*`, `storybook/*`, `react-compiler/*`, ...). The aliased
// `VpRuleOptions` is required: TS2499 forbids `extends import(...).RuleOptions`
// inside a `declare module` block, so the local interface name is referenced.
declare module "@antfu/eslint-config" {
  interface RuleOptions extends VpRuleOptions {}
}

interface VpRuleOptions extends RuleOptions {}

type AnyObject = Record<PropertyKey, any>;

type Config = NonNullable<Parameters<typeof antfu>[1]>;

type Rules = RuleOptions & AntfuEslintRules;
type ConfigNames = VpEslintConfigNames | AntfuEslintConfigNames;

/**
 * Learned from <https://github.com/antfu/eslint-config/blob/e283983/src/types.ts#L11-L23>
 */
type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, "plugins"> & {
  plugins?: Record<string, any>;
};

type Files = TypedFlatConfigItem["files"];
type Ignores = TypedFlatConfigItem["ignores"];
type Mutables<T> = T | ((config: T) => T);

interface ConfigOverrides extends Overwrite<
  DistributiveOmit<TypedFlatConfigItem, "process">,
  {
    files?: Mutables<Files>;
    ignores?: Mutables<Ignores>;
  }
> {}

/**
 * Typed composer.
 */
type VpComposer = FlatConfigComposer<TypedFlatConfigItem, ConfigNames>;

export type {
  AnyObject,
  Config,
  ConfigNames,
  ConfigOverrides,
  Rules,
  TypedFlatConfigItem,
  VpComposer,
};
