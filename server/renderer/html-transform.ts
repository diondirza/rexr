const debug = require('debug')('bumblebee:create-cache-stream');

import { Transform, TransformCallback } from 'stream';

// TODO: Only cache whitelisted key
class HTMLTransform extends Transform {
  private bufferedChunks: any[];

  private cacheKey: string;

  private redis: any;

  constructor(options: any) {
    super(options);

    this.bufferedChunks = [];
    this.redis = options.redis;
    this.cacheKey = options.cacheKey;
  }

  _transform(data: any, enc: string, cb: TransformCallback) {
    // We store the chunk of data (which is a Buffer) in memory
    this.bufferedChunks.push(data);

    if (this.bufferedChunks.length === 2) {
      // first chunk should not be passed to the stream
      return cb(null);
    }

    if (this.bufferedChunks.length === 3) {
      const [, body, head] = this.bufferedChunks;

      // 2nd chunk should be swapped and write to the stream
      return cb(null, Buffer.concat([head, body]));
    }

    // the rest should be just normal callback
    return cb(null, data);
  }

  // flush() is called when everything is done
  _flush(cb: TransformCallback) {
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
