import { interopDefault } from "@antfu/eslint-config";

const eslintReact = () => interopDefault(import("@eslint-react/eslint-plugin"));

export { eslintReact };
