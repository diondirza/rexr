import React from 'react';
import { fireEvent, render, waitForElement } from 'react-testing-library';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const AllTheProviders = ({ children }) => <Router history={history}>{children}</Router>;
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render, fireEvent, waitForElement };
