const debug = require('debug')('bumblebee:redis');

import config from '../../config';
import createRedis from './create-redis';

// TODO: use gitrev for unique deployment id
const deploymentId: string = `${__GITREV__}`;
// Locally key the cache only with "cache:", when deployed key the cache with the
// deployment's NOW_URL to avoid serving HTML that refers to non-existant scripts.
// e.g. "cache:spectrum-asdf123:"
const getKeyPrefix = () => {
  if (!deploymentId) {
    return 'cache:';
  }

  debug(`cache:${deploymentId}:`);

  return `cache:${deploymentId}:`;
};

const redis = createRedis({
  host: config.get('REDIS.HTML.HOST'),
  port: config.get('REDIS.HTML.PORT'),
  enableReadyCheck: !config.get('REDIS.HTML.NO_READY_CHECK'),
  keyPrefix: getKeyPrefix(),
  logName: 'html-redis',
});

export default redis;
