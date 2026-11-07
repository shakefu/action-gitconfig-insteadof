import js from '@eslint/js'
import globals from 'globals'

export default [
    { ignores: ['dist/', 'node_modules/'] },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node, ...globals.jest },
        },
    },
]
