import React from 'react';
import { hot } from 'react-hot-loader/root';
import { object } from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';

import ErrorBoundary from '@components/ErrorBoundary';

import ContextProvider from './context';
import Routes from './routes';

function App({ history }) {
  return (
    <HelmetProvider>
      <ContextProvider>
        <ErrorBoundary>
          <Router history={history}>
            <Routes />
          </Router>
        </ErrorBoundary>
      </ContextProvider>
    </HelmetProvider>
  );
}

App.propTypes = {
  history: object.isRequired,
};

export default hot(App);
