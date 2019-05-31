import React from 'react';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { GlobalProvider } from '@context';

const history = createBrowserHistory();
const AllTheProviders = ({ children }) => (
  <HelmetProvider>
    <GlobalProvider>
      <Router history={history}>{children}</Router>
    </GlobalProvider>
  </HelmetProvider>
);
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, fireEvent, waitForElement };
