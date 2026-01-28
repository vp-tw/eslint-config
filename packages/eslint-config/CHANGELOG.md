# @vp-tw/eslint-config

## 1.0.2

### Patch Changes

- 421cfbe: fix: add explicit type annotation to `extendsConfig` to resolve TS2742 build error

## 1.0.1

### Patch Changes

- bc6826c: - Migrate `.prettierignore` to `.eslintignore` for ESLint ignore patterns
  - Add ignore patterns to `.oxfmtrc.json` for oxfmt
  - Update VSCode workspace to recommend oxc extension
  - CI: Only run on push to main branch (PR checks still run on all PRs)

## 1.0.0

### Major Changes

- 1d2fce9: - Replace Prettier with oxfmt (Oxc-based formatter, ~30x faster)
  - Add `pnpm` extends config for `pnpm-workspace.yaml` key sorting
  - Fix `@eslint-react` plugin renaming for sub-namespaces
  - Upgrade `eslint-flat-config-utils` to v3.0.0
  - Add `typescript` option for React extends config

## 0.2.0

### Minor Changes

- 4afc2fe: chore: update deps

## 0.1.6

### Patch Changes

- a8b5090: Update dependencies to the latest versions

## 0.1.5

### Patch Changes

- 95ac0f0: copy first then build

  Fix GitHub Actions failure: [build: bump version (#12) #3 > Release](https://github.com/VdustR/eslint-config/actions/runs/15724249016/job/44310932884)

## 0.1.4

### Patch Changes

- 6ed35d6: update deps
- e7fc1bf: disable import rules

  `eslint-plugin-import-x` has been removed from `antfu/eslint-config`.

  See: [fix: remove eslint-plugin-import-x](https://github.com/antfu/eslint-config/commit/db5a31d)

## 0.1.3

### Patch Changes

- 028f436: upgrade infra

## 0.1.2

### Patch Changes

- 348d968: bump versions
