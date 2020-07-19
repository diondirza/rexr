import appRootDir from 'app-root-dir';
import debug from 'debug';
import fs from 'fs-extra';
import AssetsPlugin from 'assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import WebpackBar from 'webpackbar';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import webpack from 'webpack';

import config from '../index';
import constants from '../../constants';
import { gitRevision, isDev, isProd, isVerbose, ifDev, ifProd } from '../../utils';
import { resolve as importResolver } from '../../import.resolver';

const publicPath = constants.publicPath || config.get('PUBLIC_PATH');
const log = debug('build:rexr');
const buildPath = './build/client';

// Make sure build path is exist, if not create it
log(`> Cleaning output folder ${buildPath} ...`);
fs.emptyDirSync(path.resolve(appRootDir.get(), buildPath));

const webpackConfig = {
  /**
   * Output target to web
   */
  target: 'web',

  /**
   * Fail out if there is a single error in production mode
   */
  bail: isProd,

  /**
   * The base directory
   * for resolving entry point
   */
  context: path.resolve(appRootDir.get(), 'client'),

  /**
   * Define mode to let webpack
   * determine what plugin should be activated
   */
  mode: ifProd('production', 'development'),

  /**
   * Source map setting
   */
  devtool: ifDev('cheap-module-source-map', 'hidden-source-map'),

  /**
   * Entry files
   * Use custom polyfills
   */
  entry: {
    client: [ifDev('react-hot-loader/patch'), path.resolve(appRootDir.get(), 'client', 'index.ts')].filter(Boolean),
  },

  /**
   * Output config
   * Buildpath and output name
   */
  output: {
    path: path.resolve(appRootDir.get(), buildPath),
    publicPath,
    filename: ifDev('[name].js', '[name].[chunkhash:8].js'),
    chunkFilename: ifDev('chunk.[name].js', 'chunk.[name].[chunkhash:8].js'),
    crossOriginLoading: 'anonymous',
  },

  /**
   * Webpack 4 configuration
   * Auto minified in production, auto common chunk
   * the default is production
   */
  optimization: {
    minimize: isProd,
    minimizer: ifProd([
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 8,
          mangle: {
            safari10: true,
          },
          output: {
            ascii_only: true,
          },
        },
      }),
    ]),
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          filename: ifDev('vendor.js', 'vendor.[chunkhash].js'),
        },
      },
    },
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules'],
    alias: importResolver.alias,
  },

  module: {
    // Makes missing export becomes compile error
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // Lint
      {
        test: /\.(js|ts)x?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              configFile: path.resolve(appRootDir.get(), '.eslintrc.js'),
            },
          },
        ],
        include: path.resolve(appRootDir.get(), 'client'),
      },
      {
        oneOf: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
              },
              {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  cacheDirectory: true,
                  cacheCompression: isProd,
                  compact: isProd,
                  presets: [
                    ['@babel/preset-env', { modules: false, useBuiltIns: 'entry', corejs: 3 }],
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
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-export-namespace-from',
                    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-syntax-async-generators',
                    '@babel/plugin-syntax-dynamic-import',
                    ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
                    ['@babel/plugin-transform-runtime', { useESModules: true }],
                    'react-loadable/babel',
                    'lodash',
                    // 'graphql-tag',
                    ifDev('react-hot-loader/babel'),
                    ifDev('console'),
                  ].filter(Boolean),
                },
              },
            ],
          },
          {
            test: /\.mjs$/,
            type: 'javascript/auto',
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            use: ['graphql-tag/loader'],
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1024,
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
                  name: ifDev('[name].[ext]', '[name].[hash:6].[ext]'),
                  publicPath,
                },
              },
            ],
          },
          // fallback loader, any file that doesn't need specific loader use file-loader
          {
            exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 1024,
                  name: ifDev('[name].[ext]', '[hash:8].[ext]'),
                  publicPath,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  plugins: [
    /**
     * Define environment variable from process.env
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    /**
     * Default plugin
     * Used in all environtment
     * DefinePlugin, CommonsChunkPlugin, AssetsPlugin
     */
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __DEV__: isDev,
      __DEVTOOLS__: isVerbose, // DISABLE redux-devtools
      __GITREV__: gitRevision,
      __PROD__: isProd,
      __SERVER__: false,
      constants: JSON.stringify({ ...constants, PUBLIC_PATH: publicPath }),
      publicPath: JSON.stringify(publicPath),
    }),

    /**
     * Elegant ProgressBar and Profiler
     */
    new WebpackBar({
      color: '#61dbfb', // rexr color
    }),

    /**
     * Error formatter
     */
    new FriendlyErrorsWebpackPlugin(),

    /**
     * Extract asset pathname
     */
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.resolve(appRootDir.get(), buildPath),
      prettyPrint: isDev,
    }),

    new ReactLoadablePlugin({
      filename: path.resolve(appRootDir.get(), buildPath, 'react-loadable.json'),
    }),

    /**
     * Copy static assets
     */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(appRootDir.get(), 'static'),
          to: path.resolve(appRootDir.get(), buildPath, '../static'),
          flatten: true,
        },
      ],
    }),
  ].filter(Boolean),

  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

export default webpackConfig;
