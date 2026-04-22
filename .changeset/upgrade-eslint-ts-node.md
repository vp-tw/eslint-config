---
"@vp-tw/eslint-config": major
---

BREAKING CHANGE: Upgrade core tooling and ESLint ecosystem to their latest majors.

- `eslint`: `^9.39.2` → `^10.2.1` (removes eslintrc support; flat config required; requires Node `^20.19.0 || ^22.13.0 || >=24`)
- `@antfu/eslint-config`: `^7.2.0` → `^8.2.0`
- `@eslint-react/eslint-plugin`: `^2.7.4` → `^4.2.3` (all sub-plugins merged into a single `@eslint-react` plugin; rule names are now flat, e.g. `@eslint-react/dom-no-unsafe-target-blank` instead of `@eslint-react/dom/no-unsafe-target-blank`)
- `@eslint/config-inspector`: `^1.4.2` → `^2.0.0`
- `eslint-plugin-react-refresh`: `^0.4.26` → `^0.5.2`
- `eslint-plugin-package-json`: `^0.88.2` → `^0.91.1` (new required rules: `require-repository`, `require-sideEffects`)
- `typescript`: `^5.9.3` → `^6.0.3` (new defaults: `strict: true`, `target: es2025`, `module: esnext`, `rootDir: "."`, `types: []`, `noUncheckedSideEffectImports: true`)
- `@typescript/native-preview` (tsgo): `^7.0.0-dev.20251219.1` → `^7.0.0-dev.20260421.2`
- `@vp-tw/tsconfig`: `^3.2.1` → `^5.0.0`
- Node.js: `.nvmrc` bumped to `v25.9.0`

Internal changes to keep the config usable after the upstream shifts:

- Add an override for `antfu/react/setup` that strips removed sub-plugin keys (`react-dom`, `react-naming-convention`, `react-rsc`, `react-web-api`) and keeps only the unified `react` and `react-refresh` entries. ESLint tolerates antfu's hardcoded `react-dom/*: "off"` rules because their level is `off`.
- Extend the storybook config's plugin rename map with `react-hooks` → `react` so `eslint-plugin-storybook`'s built-in `react-hooks/rules-of-hooks: "off"` override for `*.stories.*` files continues to work against `@eslint-react`'s `react/rules-of-hooks`. This can be removed when `eslint-plugin-storybook` targets `@eslint-react` directly.
- Add `pnpm.overrides` for `undici-types` to satisfy `trustPolicy: no-downgrade`.
- Add `@types/node` to satisfy TypeScript 6's new empty-`types` default for files that use Node APIs.
- Update rule-disable directives in internal fixtures from v3 sub-plugin names (`react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`, `react-dom/no-unsafe-target-blank`) to v4 flat names under the unified `react` plugin.
- Update typegen script to reflect antfu v8's renamed/added config names (`antfu/markdown/disables/code`, `antfu/angular/*`, `antfu/react/typescript`, etc.).
- Replace the project-level `ReplaceAntfuEslintRulesWithVpRulesDeeply` deep type transform (which now exceeds TypeScript 6's instantiation depth on antfu v8's `OptionsConfig`) with a declaration-merge that extends `@antfu/eslint-config`'s `RuleOptions` interface with the project's generated rule names. Every `overrides?: Rules` field in antfu's option tree (including deeply nested ones like `react.overrides`, `typescript.overrides`, etc.) continues to autocomplete the rule names this config contributes (`react/dom-*`, `@emotion/*`, `@tanstack/query/*`, `mdx/*`, `storybook/*`, `react-compiler/*`). The project-owned option shape is extracted into a shared `VpOptions` interface so `Options` and `keyof` derivations stay in sync.
- Add `repository` and `sideEffects` fields to `package.json` for the new `eslint-plugin-package-json` requirements.
- Migrate `.eslintignore` to a flat-config `ignores` block in `eslint.config.ts` (ESLint 10 no longer supports the file) and drop the now-unused `@eslint/compat`-based `includeIgnoreFile` wiring.
- Remove the now-unused `eslint-plugin-react-hooks` dependency: `@antfu/eslint-config` v8 no longer registers the plugin and `@eslint-react` v4 owns the hook rules under the `react/` prefix.

Downstream consumers of `@vp-tw/eslint-config` should:

1. Require Node.js `^20.19.0 || ^22.13.0 || >=24`.
2. Update any existing `eslint-disable` comments that reference sub-plugin rule names removed in `@eslint-react` v4 — all five sub-plugin namespaces are folded into the unified `react` plugin with flat rule names:
   - `react-dom/<rule>` → `react/dom-<rule>`
   - `react-hooks/<rule>` → `react/<rule>`
   - `react-hooks-extra/<rule>` → `react/hooks-extra-<rule>`
   - `react-naming-convention/<rule>` → `react/naming-convention-<rule>`
   - `react-web-api/<rule>` → `react/web-api-<rule>`
3. Review any `types: []` TypeScript 6 fallout (e.g. add `@types/node` + `"types": ["node"]` in tsconfig for files that rely on Node globals).
4. If your pnpm workspace uses `trustPolicy: no-downgrade` and you hit a downgrade error on `undici-types`, add an override for it:
   ```yaml
   # pnpm-workspace.yaml
   overrides:
     undici-types: "^8.1.0"
   ```
