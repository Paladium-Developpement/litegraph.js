module.exports = {
    env: {
        browser: true,
    },
    extends: [
        "airbnb-base",
    ],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "template-curly-spacing" : "off",
        "no-underscore-dangle": 0,
        "no-continue": 0,
        "no-break": 0,
        "no-param-reassign": 0,
        "no-console": 0,
        "consistent-return": 0,
        "no-plusplus": 0,
        "no-restricted-syntax": [
            "error",
            {
                selector: "ForInStatement",
                message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
            },
            {
                selector: "LabeledStatement",
                message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
            },
            {
                selector: "WithStatement",
                message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
            },
        ],
    },
};
