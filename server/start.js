const debug = require('debug')('rexr');

import config from '../config';
import http from 'http';

import app from './index';

let currentApp = app.callback();
const server = http.createServer(currentApp);
const HOST = config.get('HOST');
const PORT = config.get('PORT');

server.listen(PORT, err => {
  if (err) {
    debug(err);
  } else {
    debug(`Bumblebee, the server-side renderer, running at http://${HOST}:${PORT} env:${process.env.NODE_ENV}`);
  }

  // Circle CI Build Success
  if (process.env.CIRCLECI || process.env.CIRCLE_CI) {
    process.exit(0);
  }
});

if (module.hot) {
  module.hot.accept('./index', () => {
    server.removeListener('request', currentApp);
    currentApp = app.callback();
    server.on('request', currentApp);
  });
}
