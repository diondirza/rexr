import React, { SFC } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '@components/Layout';

// #region import routes
import HomeComponent from '@routes/Home';
import AboutComponent from '@routes/About';
// #endregion

const Routes: SFC = () => (
  <Layout>
    <Switch>
      <Route path="/about" component={AboutComponent} />
      <Route exact path="/" component={HomeComponent} />
    </Switch>
  </Layout>
);

const RootRoutes: SFC = () => <Route component={Routes} />;

export default RootRoutes;
