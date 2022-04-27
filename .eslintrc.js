module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'deprecation', 'unused-imports'],
  extends: [
    'airbnb-typescript-prettier',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    /** allows any types to be defined */
    '@typescript-eslint/no-explicit-any': 'on',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'import/no-unresolved': 'off',
    'import/order': 'error',
    'max-classes-per-file': ['error', 5],
    'no-console': 'error',
    'no-debugger': 'error',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      { 'exceptAfterSingleLine': true },
    ],
    'curly': ['error', 'all'],
    'deprecation/deprecation': 'warn',
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ]
  },
  'overrides': [
    {
      'files': ['**/**/*.spec.ts'],
      'rules': {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
