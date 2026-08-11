import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/", "dist/"],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Warn if a variable is declared but never used
      "no-unused-vars": "warn",

      // Allow console.log()
      "no-console": "off",

      // Prevent undefined variables
      "no-undef": "error",
    },
  },

  // Jest globals for test files
  {
    files: ["tests/**/*.js"],

    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },

  // Let Prettier handle formatting
  eslintConfigPrettier,
];
