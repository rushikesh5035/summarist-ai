import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      // If code contains eslint-disable for react-hooks rules, don't fail linting
      // just because the plugin isn't installed.
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

