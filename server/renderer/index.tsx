const debug = require('debug')('bumblebee:render');

import appRootDir from 'app-root-dir';
import React, { ReactElement } from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import fetch from 'node-fetch';
import path from 'path';
import { GraphQLClient, ClientContext as GraphQLContext } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';
import { getInitialState as getGqlCacheState } from 'graphql-hooks-ssr';

// import { isSupported } from 'caniuse-api';

import { GlobalProvider } from '@context';
import ErrorBoundary from '@components/ErrorBoundary';
import htmlTemplate, { HTMLState } from './html-template';
import HTMLTransform from './html-transform';
import getInitialState from './get-initial-state';
import { FastifyInstance, FastifyRequest, FastifyReply, Plugin } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

type RendererOptions = {
  ssr: boolean;
};

const renderer: Plugin<Server, IncomingMessage, ServerResponse, RendererOptions> = (
  fastify: FastifyInstance,
  opts: RendererOptions,
  next: Function,
) => {
  let statsFile: any;
  const glb = global as any;

  try {
    statsFile = path.resolve(appRootDir.get(), './build/client/loadable-stats.json');
  } catch (err) {
    debug('Client bundle not built yet!', err);
    debug('Please build the client bundle and restart the service.');

    process.exit(1);
  }

  fastify.get('/*', async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    glb.webpSupport = true;

    const hydrateOnClient = (status = 200) => {
      const htmlStates: HTMLState = {
        initialGlobalState: {
          count: 0,
          lang: 'en',
        },
      };
      const [header, footer] = htmlTemplate(htmlStates);

      reply.code(status).type('text/html; charset=utf-8').send(`${header}${footer}`);
    };

    if (!opts.ssr) {
      debug('SSR are disabled, hydrating on client.');
      hydrateOnClient();

      return;
    }

    // PassThrough is a dummy Transform stream, simply for converting our response
    // to be a Transform stream type, without changing any chunks.
    const httpRequest = request.raw as IncomingMessage;
    const transformStream = new HTMLTransform({ cacheKey: httpRequest.url, redis: (fastify as any).redis });
    const helmetContext = {} as FilledContext;
    const routerContext: StaticRouterContext = {};
    const initialGlobalState = getInitialState();
    const Routes = require('@routes').default;
    const gqlClient = new GraphQLClient({
      url: '/graphql',
      fetch,
      ssrMode: opts.ssr,
      cache: memCache(),
    });
    const extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] });
    const App: ReactElement = (
      <ChunkExtractorManager extractor={extractor}>
        <HelmetProvider context={helmetContext}>
          <GlobalProvider initialState={initialGlobalState}>
            <GraphQLContext.Provider value={gqlClient}>
              <ErrorBoundary>
                <StaticRouter context={routerContext} location={httpRequest.url}>
                  <Routes />
                </StaticRouter>
              </ErrorBoundary>
            </GraphQLContext.Provider>
          </GlobalProvider>
        </HelmetProvider>
      </ChunkExtractorManager>
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

      const initialCacheState = await getGqlCacheState({ App, client: gqlClient });
      const bodyStream = renderToNodeStream(extractor.collectChunks(App));
      let htmlStates: HTMLState = {
        initialGlobalState,
        initialCacheState,
      };

      glb.navigator = { userAgent: request.headers['user-agent'], referer: request.headers.referer };

      if (routerContext.url) {
        reply.code(301);
        reply.header('Location', routerContext.url);
        reply.redirect(routerContext.url);

        return;
      }

      transformStream.write('<!DOCTYPE html>');
      bodyStream.pipe(transformStream, { end: false });
      bodyStream.on('end', () => {
        htmlStates = {
          ...htmlStates,
          extractor,
          helmet: helmetContext.helmet,
        };
        const [header, footer] = htmlTemplate(htmlStates);

        transformStream.write(header);
        transformStream.end(footer);
      });

      reply.code(200).type('text/html; charset=utf-8').header('Cache-Control', 'no-cache').send(transformStream);

      return;
    } catch (e) {
      const errorMessage: string = e.message;
      let finalStats: number = 200;

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
