const config = require('@config');
const session = require('koa-session');
const KoaRedis = require('koa-redis');

const { redisLogger } = require('../logger');

function sessionMiddleware(app) {
  const store = new KoaRedis({
    host: config.get('REDIS.SESSION.HOST'),
    port: config.get('REDIS.SESSION.PORT'),
    no_ready_check: true, // ini harus true, kalau false error di prod
  });
  const options = {
    key: 'tLiteSession',
    signed: false,
    store,
  };

  store.on('error', err => {
    redisLogger.error(`session: ${err}`);
  });

  return session(options, app);
}

module.exports = sessionMiddleware;
