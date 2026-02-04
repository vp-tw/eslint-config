import type EslintReact from "@eslint-react/eslint-plugin";
import { interopDefault } from "@antfu/eslint-config";

const eslintReact = (): Promise<typeof EslintReact> =>
  interopDefault(import("@eslint-react/eslint-plugin"));

export { eslintReact };
