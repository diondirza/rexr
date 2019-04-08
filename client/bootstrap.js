import React from 'react';
import { render } from 'react-dom';
import Loadable from 'react-loadable';
import { createBrowserHistory } from 'history';

import checkWebPSupport from '@helpers/checkWebPSupport';

import App from './App';
// import externalScripts from './externalScripts';

const history = createBrowserHistory();

Loadable.preloadReady().then(() => {
  const container = document.getElementById('content');

  checkWebPSupport();
  render(<App history={history} />, container);
});

// this object is used by ImageHolder components to keep track of already loaded images
global.__IMG_MAP__ = {};

// externalScripts();
