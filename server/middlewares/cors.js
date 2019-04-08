const cors = require('@koa/cors');

let whitelist = ['localhost', '127.0.0.1'];

module.exports = cors({
  origin: ctx => {
    if (process.env.NODE_ENV === 'production') {
      whitelist = ['\\.rexr.com(:[1-9][0-9]+)?/?$'];
    }

    if (new RegExp(whitelist.join('|')).test(ctx.url)) {
      return '*';
    }

    return false;
  },
  credentials: true,
});
