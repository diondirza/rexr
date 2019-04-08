import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Layout from '@components/Layout';

import HomeComponent from '@routes/Home';
// #endregion

const Routes = ({ history, location, match }) => (
  <Layout history={history} location={location} match={match}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
    </Switch>
  </Layout>
);

Routes.propTypes = {
  history: object.isRequired,
  location: object.isRequired,
  match: object.isRequired,
};

const RootRoutes = () => <Route component={Routes} />;

export default RootRoutes;
