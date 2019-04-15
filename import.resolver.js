const path = require('path');
const appRootDir = require('app-root-dir');

module.exports = {
  resolve: {
    modules: [path.resolve(appRootDir.get(), './node_modules')],
    alias: {
      '@': path.resolve(appRootDir.get(), './'),
      '@components': path.resolve(appRootDir.get(), './client/components/'),
      '@config': path.resolve(appRootDir.get(), './config/index.js'),
      '@constants': path.resolve(appRootDir.get(), './constants/index.js'),
      '@context': path.resolve(appRootDir.get(), './client/context/'),
      '@helpers': path.resolve(appRootDir.get(), './client/helpers/'),
      '@hooks': path.resolve(appRootDir.get(), './client/hooks/'),
      '@routes': path.resolve(appRootDir.get(), './client/routes/'),
      '@styles': path.resolve(appRootDir.get(), './client/styles/'),
      'validator-lite': 'validator/lib',
    },
  },
};
