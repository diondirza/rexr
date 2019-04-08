const debug = require('debug')('rexr:render');

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loadable from 'react-loadable';
import CombinedStream from 'combined-stream';
import { isSupported } from 'caniuse-api';
import { get } from 'lodash';

import config from '@config';
import ContextProvider from '@context';
import Routes from '@routes';
import { getHeader, getFooter } from './html-template';
import getBundles from './getBundles';
import createCacheStream from './createCacheStream';
import getInitialState from './getInitialState';

const ssrDisabled = config.get('SSR_STATUS') === false;
let stats;

try {
  stats = require('../../build/client/react-loadable.json');
} catch (err) {
  debug('Client bundle not built yet!', err);
  debug('Please build the client bundle and restart the service.');

  process.exit(1);
}

const renderer = async ctx => {
  debug(`server side render ${ctx.url}`);

  global.webpSupport = true;

  // TODO: Rework on preloadScripts
  // const preloadScripts = checkPreloadPath(ctx.path);

  const hydrateOnClient = (status = 200) => {
    const htmlStates = {
      initState: {
        counter: 0,
      },
      xdevice: get(ctx, 'headers[x-device]'),
    };

    ctx.status = status;
    ctx.body = `${getHeader()}${getFooter(htmlStates)}`;
  };

  if (ssrDisabled) {
    debug('SSR are disabled, hydrating on client.');
    hydrateOnClient();

    return;
  }

  // PassThrough is a dummy Transform stream, simply for converting our response
  // to be a Transform stream type, without changing any chunks.
  const transformStream = createCacheStream(ctx.path, false);
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
        <StaticRouter location={ctx.url} context={routerContext}>
          <ContextProvider initialGlobalState={initialGlobalState}>
            <Routes />
          </ContextProvider>
        </StaticRouter>
      </HelmetProvider>
    </Loadable.Capture>
  );

  try {
    // TODO: Fetch data based on page here

    const { browser, version, platform } = ctx.userAgent;
    const browserEngine = /(^iP(ad|od|hone)|iOS)$/.test(platform) ? 'last 2 Safari versions' : `${browser} ${version}`;

    try {
      global.webpSupport = isSupported('webp', browserEngine);
    } catch (e) {
      global.webpSupport = false;
    }

    const combinedStream = CombinedStream.create();
    const body = renderToNodeStream(app);
    let htmlStates = {
      scripts: [] /* preloadScripts */,
      initialGlobalState,
      xdevice: ctx.headers['x-device'],
      helmet: helmetContext.helmet,
    };

    global.navigator = { userAgent: ctx.headers['user-agent'], referer: ctx.headers.referer };

    if (routerContext.url) {
      ctx.status = 301;
      ctx.set('Location', routerContext.url);
      ctx.redirect(routerContext.url);

      return;
    }

    if (routerContext.missed) {
      ctx.status = 410;
      hydrateOnClient(410);

      return;
    }

    ctx.status = 200;
    ctx.type = 'text/html; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
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

    ctx.body = transformStream;

    return;
  } catch (e) {
    const errorMessage = e.message;

    let finalStats = 200;

    if (/\[1000410]/.test(errorMessage)) {
      finalStats = 410;
    }

    debug(`MOUNT ERROR ${ctx.url}: ${errorMessage}`);

    hydrateOnClient(finalStats);
  }
};

export default renderer;
