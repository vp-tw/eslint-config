# ESLint Config Development Guide

## Architecture

```
packages/eslint-config/src/
├── vdustr.ts          # Main entry point, orchestrates all configs
├── configs/           # Optional feature configs (emotion, mdx, prettier, etc.)
├── extends/           # Extensions for antfu configs (react, yaml, etc.)
├── lib/               # Dynamic import wrappers for optional dependencies
├── utils/             # Shared utilities (mergeConfig, extendsConfig, etc.)
└── types.ts           # Type definitions
```

## Key Patterns

### Dynamic Imports for Optional Dependencies

Optional ESLint plugins must use dynamic imports to avoid loading when disabled:

```typescript
// src/lib/eslint-react.ts
import type EslintReact from "@eslint-react/eslint-plugin";
import { interopDefault } from "@antfu/eslint-config";

// IMPORTANT: Explicit return type required to avoid TS2742 build errors
const eslintReact = (): Promise<typeof EslintReact> =>
  interopDefault(import("@eslint-react/eslint-plugin"));

export { eslintReact };
```

**Why explicit types?** Without them, TypeScript cannot infer types referencing internal modules (e.g., `@eslint-react/shared`), causing TS2742 errors during `unbuild`.

### extendsConfig Pattern

Use `extendsConfig` to extend antfu's configs conditionally:

```typescript
extendsConfig(composer, "antfu/react/rules", async (config) => {
  // Only executes if "antfu/react/rules" exists
  const plugin = await importPlugin();
  return [config, modifiedConfig];
});
```

### Config Structure

- `configs/` - Standalone configs that use `config.append()`, return arrays
- `extends/` - Modify existing antfu configs via `extendsConfig()`
- `lib/` - Dynamic import wrappers, always require explicit return types

## Commands

```bash
pnpm build              # Build the package (in packages/eslint-config)
pnpm test               # Run tests
pnpm run checkTypes     # Type check (root)
pnpm lint               # Lint all (root)
```

## Release

Managed by changesets. CI auto-publishes on main branch merge.

```bash
pnpm changeset          # Create changeset (interactive)
# Or manually create .changeset/<name>.md
```

## Common Issues

### TS2742: Inferred type cannot be named

**Cause:** Dynamic import returns type referencing internal module.
**Fix:** Add explicit return type annotation.

```typescript
// Bad - causes TS2742
const fn = () => interopDefault(import("pkg"));

// Good
const fn = (): Promise<(typeof import("pkg"))["default"]> => interopDefault(import("pkg"));
```

### Feature not loading when enabled

Check `vdustr.ts` for conditional logic. Features disabled by default need explicit enable check:

```typescript
const reactEnabled = Boolean(antfuOptions?.react ?? false);
if (reactEnabled) {
  react(config, vpOptions?.extends?.react);
}
```
