module.exports = {
    'env': {
        'browser': true,
        'node': false
    },
    'extends': ['plugin:vue/recommended'],
    'rules': {
        'vue/require-default-prop': [
            'off'
        ],
        'vue/html-indent': [
            'error',
            4
        ],
        'vue/html-closing-bracket-newline': [
            'error'
        ],
        'vue/html-closing-bracket-spacing': [
            'error'
        ],
        'vue/prop-name-casing': [
            'error'
        ]
    }
}