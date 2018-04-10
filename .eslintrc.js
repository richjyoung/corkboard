module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    "extends": ["eslint:recommended", "plugin:vue/recommended"],
    parserOptions: {
        sourceType: 'module'
    },
    plugins: ['vue', 'prettier'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-console': ['error'],
        'no-trailing-spaces': ['error'],
        'object-curly-spacing': ['error', 'always'],
        curly: ['error', 'all'],
        'key-spacing': ['error'],
        'vue/require-default-prop': ['off'],
        'vue/html-indent': ['error', 4],
        'vue/html-closing-bracket-newline': ['error'],
        'vue/html-closing-bracket-spacing': ['error'],
        'vue/prop-name-casing': ['error'],
        'prettier/prettier': ['error']
    }
};
