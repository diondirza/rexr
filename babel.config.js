module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    'babel-plugin-macros',
    ['@babel/plugin-transform-runtime', { corejs: 3, helpers: false, regenerator: true }],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
    },
  },
};
