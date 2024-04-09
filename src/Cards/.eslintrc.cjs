const path = require("path");

module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:functional/stylistic",
        "plugin:functional/no-exceptions",
        "plugin:functional/no-other-paradigms",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:fp-ts/all"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": path.resolve(__dirname, "tsconfig.json")
    },
    "plugins": [
        "functional",
        "@typescript-eslint"
    ],
    "rules": {
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-param-reassign": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_"
            }
        ],
        "functional/no-mixed-types": "off",
        "functional/no-loop-statements": "error",
        "fp-ts/no-module-imports": "off"
    }
};
