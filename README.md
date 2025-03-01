# `@vp-tw/eslint-config`

ViPro's ESLint configuration.

- Built on top of [antfu/eslint-config](https://github.com/antfu/eslint-config).
- Integrates with:
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
  - [eslint-mdx](https://github.com/mdx-js/eslint-mdx)
  - [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)
  - [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)
  - [eslint-plugin-package-json](https://github.com/JoshuaKGoldberg/eslint-plugin-package-json)
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
    // stylistic: true,
    storybook: true,
    mdx: true,
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

## Known Issues

### `eslint-plugin-unicorn@^57.0.0`

Getting the following error when call `typegen`:

<!-- cSpell:disable -->

```
/eslint-config/node_modules/.pnpm/eslint-plugin-unicorn@57.0.0_eslint@9.21.0_jiti@2.4.2_/node_modules/eslint-plugin-unicorn/rules…
│     atisIdentifierName,
│     at^
│ TypeError: Cannot destructure property 'isIdentifierName' of 'import_helper_validator_identifier.default' as it is undefined.
│     at resolveVariableName (/eslint-config/node_modules/.pnpm/eslint-plugin-unicorn@57.0.0_eslint@9.21.0_jiti@2.4.2_/node_modules…
│     at Object.<anonymous> (/eslint-config/node_modules/.pnpm/eslint-plugin-unicorn@57.0.0_eslint@9.21.0_jiti@2.4.2_/node_modules/…
│     at Module._compile (node:internal/modules/cjs/loader:1739:14)
│     at Object.transformer (/eslint-config/node_modules/.pnpm/tsx@4.19.3/node_modules/tsx/dist/register-DCnOAxY2.cjs:2:1186)
│     at Module.load (node:internal/modules/cjs/loader:1473:32)
│     at Function._load (node:internal/modules/cjs/loader:1285:12)
│     at TracingChannel.traceSync (node:diagnostics_channel:322:14)
│     at wrapModuleLoad (node:internal/modules/cjs/loader:234:24)
│     at Module.require (node:internal/modules/cjs/loader:1495:12)
│     at require (node:internal/modules/helpers:135:16)
```

<!-- cSpell:enable -->

Workaround: downgrade `eslint-plugin-unicorn` to `^56.0.1`.

```jsonc
// package.json
{
  "pnpm": {
    "overrides": {
      "eslint-plugin-unicorn": "^56.0.1",
    },
  },
}
```

## License

MIT © ViPro <vdustr@gmail.com> (<http://vdustr.dev>)
