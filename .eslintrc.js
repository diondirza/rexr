const appRootDir = require('app-root-dir');
const path = require('path');

module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
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
      node: {
        extensions: ['.js', '.jsx', '.json'],
      },
      webpack: {
        config: path.resolve(appRootDir.get(), './import.resolver.js'),
      },
      react: {
        version: '16.8.6',
      },
    },
    'import/ignore': '.(scss|less|css|png|jpg|jpeg|bmp|gif|svg)$',
    'import/extensions': ['.js', '.jsx'],
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
    'object-curly-newline': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var', 'if'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: ['if', 'return'] },
    ],
    'prettier/prettier': 'error',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/forbid-prop-types': ['warn', { forbid: ['any', 'array'] }],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
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
    'jsx-a11y/no-redundant-roles': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
  },
  globals: {
    constants: true,
    expect: true,
    publicPath: true,
    render: true,
    __DEV__: true,
    __PROD__: true,
    __TEST__: true,
    __DEVTOOLS__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __GITREV__: true,
  },
};
