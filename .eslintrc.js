module.exports = {
    root: true,
    settings: { react: { version: 'detect' } },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [ '@typescript-eslint' ],
    rules: {
        semi: [ 'error', 'never' ],
        quotes: [ 'error', 'single' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'jsx-quotes': [ 'error', 'prefer-single' ],
        'react/jsx-curly-spacing': [ 'error', 'always', {
            allowMultiline: false,
            spacing: { objectLiterals: 'always' }
        } ],
        'react/prop-types': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'indent': [ 'error', 4 ]
    },
}
