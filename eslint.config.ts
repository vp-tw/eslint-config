import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import path from "pathe";
import { vdustr } from "./packages/eslint-config/src";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eslintignorePath = path.resolve(__dirname, ".eslintignore");

export default vdustr(
  {
    react: true,
    svelte: true,
    emotion: true,
    tanstackQuery: true,
    mdx: true,
    storybook: true,
  },
  includeIgnoreFile(eslintignorePath),
);
