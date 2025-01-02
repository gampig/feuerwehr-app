module.exports = {
  root: true,

  env: {
    node: true,
    es2022: true,
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  rules: {
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        registeredComponentsOnly: true,
      },
    ],
    "vue/custom-event-name-casing": ["error", "kebab-case"],
    "vue/match-component-file-name": [
      "error",
      {
        extensions: ["ts", "vue"],
        shouldMatchCase: true,
      },
    ],
    "vue/new-line-between-multi-line-property": [
      "error",
      {
        minLineOfMultilineProperty: 2,
      },
    ],
    "vue/no-empty-component-block": ["error"],
    "vue/no-potential-component-option-typo": ["error"],
    "vue/no-reserved-component-names": [
      "error",
      {
        disallowVueBuiltInComponents: false,
        disallowVue3BuiltInComponents: false,
      },
    ],
    "vue/no-template-target-blank": ["error"],
    "vue/no-useless-mustaches": ["error"],
    "vue/no-useless-v-bind": ["error"],
    "vue/padding-line-between-blocks": ["error"],
    "vue/v-for-delimiter-style": ["error"],
    "vue/v-on-event-hyphenation": ["error"],
    "vue/multi-word-component-names": 0,
  },

  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/prettier",
    "@vue/typescript",
  ],
};
