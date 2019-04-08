const serve = require('koa-static');
const { join, resolve } = require('path');
const debug = require('debug');

const skipMiddleware = require('./skip');

function serveMiddleware(source, opts = {}) {
  if (!source) {
    return skipMiddleware;
  }

  const log = debug('middleware:serve');
  const path = resolve(join(__dirname, source));
  const maxAge = Math.min(Math.max(0, opts.maxAge), 31556926000);
  const options = {
    setHeaders(res, requestPath) {
      if (requestPath.includes('.ico')) {
        res.setHeader('Content-Type', 'image/x-icon');
      }

      res.setHeader('Cache-Control', `public, max-age=${maxAge / 1000}`);
    },
  };

  log('path:', path);

  return serve(path, options);
}

module.exports = serveMiddleware;
