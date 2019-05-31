import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '@components/Layout';

// #region import routes
import HomeComponent from '@routes/Home';
import AboutComponent from '@routes/About';
// #endregion

const Routes: FC = () => (
  <Layout>
    <Switch>
      <Route path="/about" component={AboutComponent} />
      <Route exact path="/" component={HomeComponent} />
    </Switch>
  </Layout>
);

const RootRoutes: FC = () => <Route component={Routes} />;

export default RootRoutes;
