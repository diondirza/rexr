import React, { SFC } from 'react';
import { hot } from 'react-hot-loader/root';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { GraphQLClient, ClientContext as GraphQLContext } from 'graphql-hooks';
import { History } from 'history';

import ErrorBoundary from '@components/ErrorBoundary';

import { GlobalProvider } from './context';
import Routes from './routes';

type AppProps = {
  gqlClient: GraphQLClient;
  history: History;
};

const App: SFC<AppProps> = ({ gqlClient, history }) => {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <GraphQLContext.Provider value={gqlClient}>
          <ErrorBoundary>
            <Router history={history}>
              <Routes />
            </Router>
          </ErrorBoundary>
        </GraphQLContext.Provider>
      </GlobalProvider>
    </HelmetProvider>
  );
};

export default hot(App);