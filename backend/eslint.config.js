const jsdoc = require("eslint-plugin-jsdoc");

module.exports = [
  {
    files: ["src/**/*.js"],
    plugins: { jsdoc },
    rules: {
      "jsdoc/multiline-blocks": ["warn", { noSingleLineBlocks: true }],
      "jsdoc/tag-lines": ["warn", "never"],
      "jsdoc/sort-tags": "warn",
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-types": "warn",
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns-type": "warn",
    },
  },
];
