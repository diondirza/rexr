const appRootDir = require('app-root-dir');
const path = require('path');
const webpackResolver = require('./import.resolver');

module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/react',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    sourceType: 'module',
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
        config: webpackResolver,
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
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'no-use-before-define': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var', 'if'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: ['if', 'return'] },
    ],
    'prettier/prettier': 'error',
    'import/no-cycle': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.config*.{ts,tsx,js}',
          '**/*.test.{ts,tsx,js}',
          'config/**/*.{ts,tsx,js}',
          'e2e/**/*.{ts,tsx,js}',
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
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        ignoreCase: true,
        reservedFirst: true,
        shorthandFirst: true,
      },
    ],
    'react/sort-prop-types': [
      'warn',
      {
        callbacksLast: true,
        ignoreCase: true,
        requiredFirst: false,
        sortShapeProp: true,
      },
    ],
    'react/state-in-constructor': 'off',
    'react/static-property-placement': ['error', 'static public field'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'testing-library/prefer-screen-queries': 'warn',
    'testing-library/prefer-wait-for': 'error',
  },
  globals: {
    constants: true,
    expect: true,
    globalThis: true,
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
