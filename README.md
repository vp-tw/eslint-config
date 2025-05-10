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
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- Fine-tuned to provide an opinionated, optimal DX. Please copy the VSCode settings from [eslint-config.code-workspace](https://github.com/VdustR/eslint-config/blob/main/eslint-config.code-workspace).

Check [here](https://vdustr.dev/eslint-config) to preview the ESLint inspection.

## Installation

```bash
pnpm i -D eslint @antfu/eslint-config @vp-tw/eslint-config
```

## Usage

Simlar to [antfu/eslint-config](https://github.com/antfu/eslint-config) but with additional options:

```ts
// eslint.config.ts
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import { vdustr } from "@vp-tw/eslint-config";
import path from "pathe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prettierignorePath = path.resolve(__dirname, ".prettierignore");

export default vdustr(
  {
    // By default, we disable `stylistic` and use `prettier` instead.
    // stylistic: false,

    // Defaults
    packageJson: true,
    emotion: false,
    tanstackQuery: false,
    mdx: false,
    storybook: false,
    prettier: true,
  },
  includeIgnoreFile(prettierignorePath),
);
```

## Release

```bash
pnpm -w v:patch # or
pnpm -w v:minor # or
pnpm -w v:major

pnpm -r publish
```

## License

MIT © ViPro <vdustr@gmail.com> (<http://vdustr.dev>)
