import React from 'react';
import { render, hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { GraphQLClient } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';
import { History, createBrowserHistory } from 'history';

import checkWebPSupport from '@helpers/check-webp-support';

import App from './App';
// import externalScripts from './external-scripts';

const w = window as any;
const history: History = createBrowserHistory();
const gqlClient = new GraphQLClient({
  url: '/graphql',
  ssrMode: !w.csr,
  cache: memCache({
    initialState: w.__cache,
  }),
});

Loadable.preloadReady().then(() => {
  const container = document.getElementById('app');
  const bootstrap = w.csr ? render : hydrate;
  const props = {
    gqlClient,
    history,
  };

  checkWebPSupport();
  bootstrap(<App {...props} />, container);
});

// this object is used by ImageHolder components to keep track of already loaded images
(global as any).__IMG_MAP__ = {};

// externalScripts();
