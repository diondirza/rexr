const config = require('@config');
const koaPino = require('koa-pino-logger');

const skipMiddleware = require('./skip');

function loggerMiddleware() {
  // TODO: fix the flagging, should be config.flags.logger !== 'active'
  if (!config.get('FLAGS.LOGGER')) {
    return skipMiddleware;
  }

  return koaPino(config.get('LOG_CONFIG'));
}

module.exports = loggerMiddleware;
