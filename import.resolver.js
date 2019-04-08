const path = require('path');
const appRootDir = require('app-root-dir');

module.exports = {
  resolve: {
    modules: [path.resolve(appRootDir.get(), './node_modules')],
    alias: {
      '@': path.resolve(appRootDir.get(), './'),
      '@config': path.resolve(appRootDir.get(), './config/index.js'),
      '@constants': path.resolve(appRootDir.get(), './constants/index.js'),
      '@components': path.resolve(appRootDir.get(), './client/components/'),
      '@context': path.resolve(appRootDir.get(), './client/context/'),
      '@helpers': path.resolve(appRootDir.get(), './client/helpers/'),
      '@styles': path.resolve(appRootDir.get(), './client/styles/'),
      '@routes': path.resolve(appRootDir.get(), './client/routes/'),
      'validator-lite': 'validator/lib',
    },
  },
};
