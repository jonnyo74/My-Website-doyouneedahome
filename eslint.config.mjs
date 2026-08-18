import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin but turns on only
  // a handful of its rules, so we widen it to the plugin's full recommended set
  // rather than re-declaring the plugin (which flat config forbids). Catches
  // missing alt text, labels with no control, click handlers on <div>, invalid
  // ARIA attributes and roles, positive tabindex. Dev-only — nothing ships.
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Next's <Link> renders a real <a href>, but the rule can't see through
      // the component wrapper, so it flags every one of them.
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Throwaway agent worktrees hold a second copy of src/ and double every
    // finding.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
