---
"@vp-tw/eslint-config": patch
---

Document the consumer-owned pnpm resolutions for the minimatch globparts advisory. The workspace uses patched minimatch 11.0.1 with compatible glob 14.0.0 and checks ordinary matching and lint diagnostics. Downstream projects must apply their own resolutions; workspace overrides are not inherited from this package.
