import { interopDefault } from "@antfu/eslint-config";

const eslintReact = async () => {
  const eslintReact = await interopDefault(import("@eslint-react/eslint-plugin"));
  return eslintReact;
};

export { eslintReact };
