const debug = require('debug')('redis:create');
const Redis = require('ioredis');
const Promise = require('bluebird');
const { redisLogger } = require('../logger');

Redis.Promise = Promise.config({
  cancellation: true,
});

function createRedis({ logName = '', noEvent = false, ...config }) {
  const redisClient = new Redis(config);

  if (noEvent) {
    return redisClient;
  }

  // TODO: Rework on error handler.
  redisClient.on('error', err => {
    debug(`ERROR REDIS (${logName})`);

    redisLogger.error(err);
  });

  const t = setTimeout(() => {
    debug(`REDIS (${logName}): failed to connect`);
  }, 5000);

  redisClient.on('ready', () => {
    clearTimeout(t);

    debug(`REDIS (${logName}): connected`);
  });

  redisClient.on('end', () => {
    clearTimeout(t);
    debug(`REDIS (${logName}): disconnected`);
  });

  return redisClient;
}

module.exports = createRedis;
