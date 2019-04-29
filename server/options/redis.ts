import config from '@config';

const redisOptions = {
  host: config.get('REDIS.SESSION.HOST'),
  port: config.get('REDIS.SESSION.PORT'),
  enableReadyCheck: __DEV__,
  keyPrefix: 'sessionKey',
};

export default redisOptions;
