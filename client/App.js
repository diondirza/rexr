import React from 'react';
import { hot } from 'react-hot-loader/root';
import { object } from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { ClientContext as GraphQLContext } from 'graphql-hooks';

import ErrorBoundary from '@components/ErrorBoundary';

import ContextProvider from './context';
import Routes from './routes';

function App({ gqlClient, history }) {
  return (
    <HelmetProvider>
      <ContextProvider>
        <GraphQLContext.Provider value={gqlClient}>
          <ErrorBoundary>
            <Router history={history}>
              <Routes />
            </Router>
          </ErrorBoundary>
        </GraphQLContext.Provider>
      </ContextProvider>
    </HelmetProvider>
  );
}

App.propTypes = {
  gqlClient: object.isRequired,
  history: object.isRequired,
};

export default hot(App);
