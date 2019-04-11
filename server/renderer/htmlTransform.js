const debug = require('debug')('rexr:create-cache-stream');

import { Transform } from 'stream';

// TODO: Only cache whitelisted key
class HTMLTransform extends Transform {
  constructor(options) {
    super(options);

    this.bufferedChunks = [];
    this.redis = options.redis;
    this.cacheKey = options.cacheKey;
  }

  _transform(data, enc, cb) {
    // We store the chunk of data (which is a Buffer) in memory
    this.bufferedChunks.push(data);

    if (this.bufferedChunks.length === 1) {
      // first chunk should not be passed to the stream
      return cb(null);
    }

    if (this.bufferedChunks.length === 2) {
      const [body, head] = this.bufferedChunks;

      // 2nd chunk should be swapped and write to the stream
      return cb(null, Buffer.concat([head, body]));
    }

    // the rest should be just normal callback
    return cb(null, data);
  }

  // flush() is called when everything is done
  _flush(cb) {
    if (process.env.DISABLE_CACHE) {
      debug('html-cache are disabled by ENV.');
      cb();
    }

    // We can simply disable the HTML caching by env here
    if (!process.env.DISABLE_CACHE) {
      // We concatenate all the buffered chunks of HTML to get the full HTML
      // then cache it at "key"
      this.redis.set(this.cacheKey, Buffer.concat(this.bufferedChunks), 'ex', 3600);

      debug(`successfully caching ${this.cacheKey} html to redis`);
      cb();
    }
  }
}

export default HTMLTransform;
