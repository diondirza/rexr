require('@babel/register');
const appRootDir = require('app-root-dir');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('..');
const constants = require('../../constants');
const { gitRevision } = require('../../utils');
const { normalizeCSS, criticalCSS } = require('../../utils/html/critical-css');
const preconnectTags = require('../../utils/html/preconnect-tags').default;

const webpackClientConfig = require('./client.babel').default;

const gtmId = constants.GTM_CONTAINER_ID;
const host = config.get('HOST');
const port = config.get('CLIENT.PORT');

webpackClientConfig.module.rules[2].oneOf = [
  {
    test: /\.ejs$/,
    loader: 'ejs-loader',
    options: {
      esModule: false,
    },
  },
  ...webpackClientConfig.module.rules[2].oneOf,
];

webpackClientConfig.plugins = [
  ...webpackClientConfig.plugins,
  new HtmlWebpackPlugin({
    template: path.resolve(appRootDir.get(), './static/base-shell.ejs'),
    chunksSortMode: 'none',
    meta: {
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      'theme-color': '#009ca6',
    },
    scriptLoading: 'defer',
    templateParameters: (compilation, assets, assetTags, options) => ({
      compilation,
      constants: JSON.stringify(constants),
      criticalCSS,
      gitRev: gitRevision,
      gtmId,
      htmlWebpackPlugin: {
        files: assets,
        options,
        tags: assetTags,
      },
      initialState: {},
      normalizeCSS,
      preconnects: preconnectTags,
      webpackConfig: compilation.options,
    }),
  }),
];

webpackClientConfig.devServer = {
  clientLogLevel: 'none',
  compress: true,
  contentBase: path.resolve(appRootDir.get(), 'static'),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
  historyApiFallback: true,
  host,
  hot: true,
  open: true,
  port,
  publicPath: webpackClientConfig.output.publicPath,
  quiet: true,
  watchContentBase: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};

module.exports = webpackClientConfig;
