const debug = require('debug')('rexr:render');

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loadable from 'react-loadable';
import CombinedStream from 'combined-stream';
// import { isSupported } from 'caniuse-api';
// import { get } from 'lodash';

import ContextProvider from '@context';
import Routes from '@routes';
import { getHeader, getFooter } from './html-template';
import getBundles from './getBundles';
import createCacheStream from './createCacheStream';
import getInitialState from './getInitialState';

const renderer = (fastify, opts, next) => {
  let stats;

  try {
    stats = require('../../build/client/react-loadable.json');
  } catch (err) {
    debug('Client bundle not built yet!', err);
    debug('Please build the client bundle and restart the service.');

    process.exit(1);
  }

  fastify.get('/*', async (request, reply) => {
    debug(`server side render test ${request.raw.url}`);

    global.webpSupport = true;

    // TODO: Rework on preloadScripts
    // const preloadScripts = checkPreloadPath(ctx.path);

    const hydrateOnClient = (status = 200) => {
      const htmlStates = {
        initState: {
          counter: 0,
        },
      };

      reply
        .code(status)
        .type('text/html; charset=utf-8')
        .send(`${getHeader()}${getFooter(htmlStates)}`);
    };

    if (!opts.ssr) {
      debug('SSR are disabled, hydrating on client.');
      hydrateOnClient();
    }

    // PassThrough is a dummy Transform stream, simply for converting our response
    // to be a Transform stream type, without changing any chunks.
    const transformStream = createCacheStream(request.raw.path, false);
    const helmetContext = {};
    const routerContext = {};

    const modules = [];
    const report = moduleName => {
      modules.push(moduleName);
    };

    const initialGlobalState = getInitialState();

    const app = (
      <Loadable.Capture report={report}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={request.raw.url} context={routerContext}>
            <ContextProvider initialGlobalState={initialGlobalState}>
              <Routes />
            </ContextProvider>
          </StaticRouter>
        </HelmetProvider>
      </Loadable.Capture>
    );

    try {
      // TODO: Fetch data based on page here

      // const { browser, version, platform } = ctx.userAgent;
      // const browserEngine = /(^iP(ad|od|hone)|iOS)$/.test(platform)
      //   ? 'last 2 Safari versions'
      //   : `${browser} ${version}`;

      // try {
      //   global.webpSupport = isSupported('webp', browserEngine);
      // } catch (e) {
      //   global.webpSupport = false;
      // }

      const combinedStream = CombinedStream.create();
      const body = renderToNodeStream(app);
      let htmlStates = {
        scripts: [] /* preloadScripts */,
        initialGlobalState,
        helmet: helmetContext.helmet,
      };

      global.navigator = { userAgent: request.headers['user-agent'], referer: request.headers.referer };

      if (routerContext.url) {
        reply.code(301);
        reply.header('Location', routerContext.url);
        reply.redirect(routerContext.url);

        return;
      }

      if (routerContext.missed) {
        hydrateOnClient(410);

        return;
      }

      htmlStates = {
        ...htmlStates,
        bundles: getBundles(stats, modules),
      };

      combinedStream.append(getHeader(htmlStates));
      combinedStream.append(body);
      combinedStream.pipe(
        transformStream,
        { end: false },
      );
      combinedStream.on('end', () => {
        transformStream.end(getFooter(htmlStates));
      });

      reply
        .code(200)
        .type('text/html; charset=utf-8')
        .header('Cache-Control', 'no-cache')
        .send(transformStream);

      return;
    } catch (e) {
      const errorMessage = e.message;

      let finalStats = 200;

      if (/\[1000410]/.test(errorMessage)) {
        finalStats = 410;
      }

      debug(`MOUNT ERROR ${request.raw.url}: ${errorMessage}`);

      hydrateOnClient(finalStats);
    }
  });

  next();
};

export default renderer;
