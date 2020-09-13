import appRootDir from 'app-root-dir';
import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import WebpackBar from 'webpackbar';
import nodeExternals from 'webpack-node-externals';

import config from '../index';
import constants from '../../constants';
import { gitRevision, isCircleCI, isDev, isProd, ifDev, ifProd } from '../../utils';

import { resolve as importResolver } from '../../import.resolver';

const log = debug(`build:bumblebee`);
const publicPath = constants.publicPath || config.get('PUBLIC_PATH');

const entryPath = `./server/${isDev ? 'start' : 'index'}.ts`;
const buildPath = `./build/server`;

log(`> Cleaning output folder ${buildPath} ...`);
fs.emptyDirSync(buildPath);

log(`> Building bumblebee, entry: ${entryPath}, output: ${path.join(buildPath, 'index.ts')}`);

const developmentPlugins = () => {
  if (isDev && !isCircleCI) {
    // need to lazy load this plugin
    const StartServerPlugin = require('start-server-webpack-plugin');

    return [new StartServerPlugin('index.js'), new webpack.HotModuleReplacementPlugin()];
  }

  return [];
};

const webpackConfig = {
  /**
   * Output target to NodeJS
   */
  target: 'node',

  /**
   * Fail out if there is a single error in production mode
   */
  bail: isProd,

  /**
   * The base directory
   * for resolving entry point
   */
  context: path.resolve(appRootDir.get(), 'server'),

  /**
   * Define mode to let webpack
   * determine what plugin should be activated
   */
  mode: ifProd('production', 'development'),

  /**
   * Source map setting
   */
  devtool: 'source-map',

  /**
   * Define perfomance hints for assets
   * and entrypoints that exceed file limit
   */
  performance: false,

  stats: 'errors-only',

  /**
   * Entry files
   */
  entry: {
    index: [
      'make-promises-safe',
      'core-js/stable',
      'regenerator-runtime/runtime',
      'node-fetch',
      ifDev('webpack/hot/poll?1000'),
      path.resolve(appRootDir.get(), entryPath),
    ].filter(Boolean),
  },

  /** Need this to support recompile with HMR */
  watch: isDev && !isCircleCI,

  /**
   * Output config
   * Buildpath and output name
   */
  output: {
    path: path.resolve(appRootDir.get(), buildPath),
    filename: '[name].js',
    chunkFilename: ifDev('chunk.[name].js', 'chunk.[name].[chunkhash:8].js'),
    publicPath,
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules'],
    alias: importResolver.alias,
    symlinks: false,
    cacheWithContext: false,
  },

  module: {
    // Makes missing export becomes compile error
    strictExportPresence: true,
    noParse: /lodash/,
    rules: [
      {
        oneOf: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
              cacheCompression: isProd,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: true,
                    },
                    useBuiltIns: 'entry',
                    corejs: 3,
                  },
                ],
                '@babel/preset-typescript',
                ['@babel/preset-react', { development: isDev, useBuiltIns: true }],
                [
                  '@emotion/babel-preset-css-prop',
                  {
                    autoLabel: true,
                    labelFormat: '[local]',
                    sourceMap: isDev,
                  },
                ],
              ],
              plugins: [
                'babel-plugin-macros',
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                [
                  '@babel/plugin-transform-runtime',
                  {
                    // corejs: 3,  this is not supported yet for node!!
                    helpers: false,
                  },
                ],
                '@loadable/babel-plugin',
                'lodash',
                ifDev('console'),
              ],
            },
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1024,
                  emitFile: false,
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 1024,
                  name: ifDev('[name].[ext]', '[hash:8].[ext]'),
                  publicPath: config.get('PUBLIC_PATH'),
                  emitFile: false,
                },
              },
            ],
          },
          // fallback loader, any file that doesn't need specific loader use file-loader
          {
            exclude: [/\.(t|j)sx?$/, /\.html$/, /\.json$/],
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 1024,
                  name: ifDev('[name].[ext]', '[hash:8].[ext]'),
                  publicPath,
                  emitFile: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  externals: [
    /^\.\/assets\.json$/,
    /**
     * Ignore node_modules being bundled
     * on server build
     */
    nodeExternals({
      allowlist: [
        ...ifDev(['webpack/hot/poll?1000'], []),
        'source-map-support/register',
        /^@lite\/(utils|components)/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(css|scss|sass|sss|less)$/,
      ],
    }),
  ],

  optimization: {
    minimize: false,
  },

  plugins: [
    /**
     * Development webpack plugin
     * Won't be enabled in production
     */
    ...developmentPlugins(),

    /**
     * Define environment variable from process.env
     */
    new webpack.EnvironmentPlugin({
      // use 'development' unless process.env.NODE_ENV is defined
      NODE_ENV: 'development',
    }),

    /**
     * Define variable on build time
     */
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __DEV__: isDev,
      __GITREV__: gitRevision,
      __PROD__: isProd,
      __SERVER__: true,
      constants: JSON.stringify({ ...constants }),
    }),

    /**
     * Elegant ProgressBar and Profiler
     */
    new WebpackBar({
      color: '#83cd29',
    }),

    /**
     * Error formatter
     */
    new FriendlyErrorsWebpackPlugin(),

    /**
     * Enable source map on server
     */
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install({ environment: "node" });',
      raw: true,
      entryOnly: false,
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(appRootDir.get(), '.env.example'),
          to: path.resolve(appRootDir.get(), 'build'),
        },
      ],
    }),
  ],

  node: false,
};

export default webpackConfig;
