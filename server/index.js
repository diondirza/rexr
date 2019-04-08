const debug = require('debug')('rexr');

debug('Starting...');

import config from '@config';
import Koa from 'koa';
import compress from 'koa-compress';
import userAgent from 'koa-useragent';
import Loadable from 'react-loadable';

import cors from './middlewares/cors';
import errorHandler from './middlewares/errorHandler';
import logger from './middlewares/logger';
import serve from './middlewares/serve';
import addSecurity from './middlewares/addSecurity';
import session from './middlewares/session';
import handleError from './handleError';
import renderer from './renderer';

const HOST = config.get('HOST');
const PORT = config.get('PORT');
const SECRET = config.get('SECRET');

const app = new Koa();

app.keys = [SECRET];

app.on('error', handleError);

app.use(logger());

app.use(errorHandler);

if (__PROD__) {
  app.proxy = true;
  addSecurity(app);
}

app.use(userAgent);

app.use(cors);

app.use(compress());

if (__DEV__) {
  app.use(serve('../../static'));
}

app.use(session(app));

app.use(renderer);

Loadable.preloadAll().then(() => {
  if (__PROD__) {
    app.listen(PORT);
    debug(`rexr the server-side renderer, running at http://${HOST}:${PORT}`);
  }
});

export default app;
