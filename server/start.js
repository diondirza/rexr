const debug = require('debug')('rexr');

import config from '../config';

import app from './index';

let currentApp = app;
const HOST = config.get('HOST');
const PORT = config.get('PORT');

const startDevServer = () => {
  currentApp.listen(PORT, HOST, (err, address) => {
    if (err) {
      debug(err);
      process.exit(1);
    } else {
      debug(`ReXR, the server-side renderer, listening on ${address} env:${process.env.NODE_ENV}`);
    }
  });
};

startDevServer();

// Circle CI Build Success
if (process.env.CIRCLECI || process.env.CIRCLE_CI) {
  process.exit(0);
}

if (module.hot) {
  module.hot.accept('./index', () => {
    currentApp.close();
    currentApp = app;
    startDevServer();
  });
}
