import process from "node:process";

const isFormat = process.env.LINT_STAGED_TYPE === "format";
/**
 * @type {import('lint-staged').Configuration}
 */
const config = isFormat
  ? {
      "**/*": [
        "eslint --report-unused-disable-directives --fix --max-warnings=0 --no-error-on-unmatched-pattern --no-warn-ignored",
        "oxfmt --write --no-error-on-unmatched-pattern",
      ],
    }
  : {
      "**/*": ["cspell lint --no-must-find-files", "vitest related --run"],
      "**/(*.{js,ts,jsx,tsx}|tsconfig.json|tsconfig.*.json)": () => "pnpm run -w checkTypes",
    };

export default config;
