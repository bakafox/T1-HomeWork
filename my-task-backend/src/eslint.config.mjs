import antfu from '@antfu/eslint-config'

export default antfu(
    {
        ignores: [
            '**/node_modules',
            'package.json',
            'package-lock.json',
            'tsconfig*',
            '*.config.js',
        ],

        type: 'lib',

        stylistic: {
            indent: 4,
            quotes: 'single',
        },

        typescript: true,
        react: true,
    },
    {
        rules: {
            'style/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
            'style/max-statements-per-line': ['error', { max: 99 }],
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            'style/member-delimiter-style': ['error', { multiline: { delimiter: 'comma' }, singleline: { delimiter: 'comma' } }],
            'react-hooks/exhaustive-deps': ['off'],
        },
    },
)
