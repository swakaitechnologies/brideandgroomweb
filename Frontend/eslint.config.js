import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "public/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react": reactPlugin,
      "react-hooks": hooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      // React hooks rules
      ...hooksPlugin.configs.recommended.rules,

      // React rules - manually selected
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/display-name": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: [
      "postcss.config.mjs"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
