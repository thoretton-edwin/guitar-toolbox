import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "coverage", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      unicorn.configs["flat/recommended"],
      sonarjs.configs.recommended,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    extends: [testingLibrary.configs["flat/react"]],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  {
    files: ["*.config.{js,ts}", ".dependency-cruiser.cjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
]);
