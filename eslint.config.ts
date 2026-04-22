import { vdustr } from "./packages/eslint-config/src";

export default vdustr(
  {
    react: true,
    svelte: true,
    emotion: true,
    tanstackQuery: true,
    mdx: true,
    storybook: true,
  },
  {
    ignores: [
      "pnpm-lock.yaml",
      "**/dist/**",
      "packages/eslint-config/src/eslint-typegen.d.ts",
      ".eslint-config-inspector/**",
      ".changeset/**",
      "**/CHANGELOG.md",
      "**/LICENSE",
    ],
  },
);
