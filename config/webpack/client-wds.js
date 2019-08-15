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

const baseShellPath = path.resolve(appRootDir.get(), 'static', 'base-shell.ejs');
const gtmId = constants.GTM_CONTAINER_ID;
const host = config.get('HOST');
const port = config.get('CLIENT.PORT');

webpackClientConfig.plugins = [
  ...webpackClientConfig.plugins,
  new HtmlWebpackPlugin({
    template: `!!ejs-loader!${baseShellPath}`,
    chunksSortMode: 'none',
    gtmId,
    gitRev: gitRevision,
    preconnects: preconnectTags,
    normalizeCSS,
    criticalCSS,
    initialState: {},
    NODE_ENV: process.env.NODE_ENV,
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
