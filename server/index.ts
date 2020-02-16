const debug = require('debug')('bumblebee');

debug('Starting...');

import config from '@config';
import appRootDir from 'app-root-dir';
import fastify from 'fastify';
import compress from 'fastify-compress';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import redis from 'fastify-redis';
import path from 'path';
import Loadable from 'react-loadable';

import handleError from './handle-error';
import corsOptions from './options/cors';
import redisOptions from './options/redis';
import renderer from './renderer';

const HOST = config.get('HOST');
const PORT = config.get('PORT');

const app = fastify({
  logger: config.get('FLAGS.LOGGER') ? config.get('LOG_CONFIG') : false,
  trustProxy: __PROD__,
});

app.setErrorHandler(handleError);

if (__PROD__) {
  app.register(helmet);
}

app.register(cors, corsOptions);

app.register(compress);

if (__DEV__) {
  app.register(require('fastify-static'), {
    root: path.resolve(appRootDir.get(), 'static'),
    wildcard: false,
  });
}

app.register(redis, redisOptions);

app.register(renderer, { ssr: config.get('SSR_STATUS') });

const startServer = async () => {
  try {
    await Loadable.preloadAll();

    if (__PROD__) {
      const address: string = await new Promise((resolve, reject) => {
        app.listen(PORT, HOST, (err, addr) => {
          if (!err) resolve(addr);
          else reject(err);
        });
      });

      debug(`bumblebee the server-side renderer, listening at ${address}`);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();

export default app;
