const debug = require('debug')('rexr:create-cache-stream');

import { Transform } from 'stream';

import redis from '../redis';

// TODO: Only cache whitelisted key
const createCacheStream = (key, enable) => {
  const bufferedChunks = [];

  return new Transform({
    // transform() is called with each chunk of data
    transform(data, enc, cb) {
      // We store the chunk of data (which is a Buffer) in memory
      bufferedChunks.push(data);
      // Then pass the data unchanged onwards to the next stream
      cb(null, data);
    },

    // flush() is called when everything is done
    flush(cb) {
      if (process.env.DISABLE_CACHE) {
        debug('html-cache are disabled by ENV.');
        cb();
      }

      // We can simply disable the HTML caching by env here
      if (!process.env.DISABLE_CACHE && enable) {
        // We concatenate all the buffered chunks of HTML to get the full HTML
        // then cache it at "key"
        redis.set(key, Buffer.concat(bufferedChunks), 'ex', 3600);

        debug(`successfully caching ${key} html to redis`);
        cb();
      }
    },
  });
};

export default createCacheStream;
