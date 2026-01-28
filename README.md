# `@vp-tw/eslint-config`

ViPro's ESLint configuration.

- Built on top of [antfu/eslint-config](https://github.com/antfu/eslint-config).
- Integrates with:
  - [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)
  - [eslint-plugin-package-json](https://github.com/JoshuaKGoldberg/eslint-plugin-package-json)
  - [@emotion/eslint-plugin](https://www.npmjs.com/package/@emotion/eslint-plugin)
  - [@tanstack/eslint-plugin-query](https://www.npmjs.com/package/@tanstack/eslint-plugin-query)
  - [eslint-mdx](https://github.com/mdx-js/eslint-mdx)
  - [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)
  - [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - disables formatting rules to work with any formatter (Prettier, oxfmt, etc.)
- Fine-tuned to provide an opinionated, optimal DX. Please copy the VSCode settings from [eslint-config.code-workspace](https://github.com/VdustR/eslint-config/blob/main/eslint-config.code-workspace).

Check [here](https://vdustr.dev/eslint-config) to preview the ESLint inspection.

## Installation

```bash
pnpm i -D eslint @antfu/eslint-config @vp-tw/eslint-config
```

## Usage

Similar to [antfu/eslint-config](https://github.com/antfu/eslint-config) but with additional options:

```ts
// eslint.config.ts
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import { vdustr } from "@vp-tw/eslint-config";
import path from "pathe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eslintignorePath = path.resolve(__dirname, ".eslintignore");

export default vdustr(
  {
    // By default, we disable `stylistic` and use `prettier` instead.
    // stylistic: false,

    // Options (defaults shown)
    react: false, // Enable React support with eslint-react strict-typescript rules
    svelte: false, // Enable Svelte support
    packageJson: true, // Enable package.json linting
    emotion: false, // Enable Emotion CSS-in-JS linting
    tanstackQuery: false, // Enable TanStack Query linting
    mdx: false, // Enable MDX linting
    storybook: false, // Enable Storybook linting
    prettier: true, // Enable eslint-config-prettier to disable formatting rules

    // Extends options for fine-grained control
    extends: {
      react: {
        typescript: true, // Use strict-typescript rules (default: true)
      },
    },
  },
  includeIgnoreFile(eslintignorePath),
);
```

## Features

### React Support

When `react: true`, this config uses `@eslint-react/eslint-plugin` with `strict-typescript` rules by default. You can disable TypeScript-specific rules:

```ts
export default vdustr({
  react: true,
  extends: {
    react: {
      typescript: false, // Use strict rules instead of strict-typescript
    },
  },
});
```

### pnpm Workspace Sorting

Automatically sorts keys in `pnpm-workspace.yaml` alphabetically using `yaml/sort-keys` rule.

## Release

```bash
pnpm -w v:patch # or
pnpm -w v:minor # or
pnpm -w v:major

pnpm -r publish
```

## License

MIT © ViPro <vdustr@gmail.com> (<http://vdustr.dev>)
