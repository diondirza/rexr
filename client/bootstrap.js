import React from 'react';
import { render, hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { GraphQLClient } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';
import { createBrowserHistory } from 'history';

import checkWebPSupport from '@helpers/checkWebPSupport';

import App from './App';
// import externalScripts from './externalScripts';

const history = createBrowserHistory();
const gqlClient = new GraphQLClient({
  url: '/graphql',
  ssrMode: !window.csr,
  cache: memCache({
    initialState: window.__cache,
  }),
});

Loadable.preloadReady().then(() => {
  const container = document.getElementById('app');
  const bootstrap = window.csr ? render : hydrate;
  const props = {
    gqlClient,
    history,
  };

  checkWebPSupport();
  bootstrap(<App {...props} />, container);
});

// this object is used by ImageHolder components to keep track of already loaded images
global.__IMG_MAP__ = {};

// externalScripts();
