const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const git = require('git-rev-sync');
const { ifElse } = require('./logic');

const gitRevision = JSON.stringify(git.long());

const isCircleCI = process.env.CIRCLECI === 'true' || process.env.CIRCLE_CI === 'true';
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const ifCircleCI = ifElse(isCircleCI);
const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);

const lessLoaders = ({ isClient = true, paths } = {}) => [
  ifDev('style-loader', MiniCssExtractPlugin.loader),
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      exportOnlyLocals: !isClient,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [postcssPresetEnv({ stage: 2 })],
    },
  },
  {
    loader: 'less-loader',
    options: {
      paths,
    },
  },
];

module.exports = {
  gitRevision,
  ifCircleCI,
  ifDev,
  ifProd,
  isCircleCI,
  isDev,
  isProd,
  lessLoaders,
};
