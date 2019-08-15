const appRootDir = require('app-root-dir');
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript', 'prettier', 'prettier/@typescript-eslint', 'prettier/react'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['import', 'prettier', 'react', 'react-hooks', 'jest'],
  env: {
    amd: true,
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
      webpack: {
        config: path.resolve(appRootDir.get(), './import.resolver.js'),
      },
    },
  },
  rules: {
    camelcase: [
      'error',
      {
        allow: ['^UNSAFE_'],
        properties: 'never',
        ignoreDestructuring: false,
      },
    ],
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'no-unused-expressions': ['error', { allowTaggedTemplates: true, allowShortCircuit: true }],
    'no-use-before-define': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var', 'if'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: ['if', 'return'] },
    ],
    'prettier/prettier': 'error',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.config*.{ts,tsx,js}',
          '**/*.test.{ts,tsx,js}',
          'config/**/*.{ts,tsx,js}',
          'scripts/**/*.{ts,tsx,js}',
          'test/**/*.{ts,tsx,js}',
          'utils/**/*.{ts,tsx,js}',
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/sort-prop-types': [
      'warn',
      {
        callbacksLast: true,
        ignoreCase: true,
        requiredFirst: false,
        sortShapeProp: true,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  globals: {
    constants: true,
    expect: true,
    globalThis: true,
    publicPath: true,
    render: true,
    __CLIENT__: true,
    __DEV__: true,
    __DEVTOOLS__: true,
    __GITREV__: true,
    __PROD__: true,
    __SERVER__: true,
    __TEST__: true,
  },
};
