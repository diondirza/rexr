import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '@components/Layout';
import Loading from '@components/Loading';

// #region import routes
import HomeComponent from '@routes/Home';
import AboutComponent from '@routes/About';
// #endregion

const Routes: FC = () => (
  <Layout>
    <Switch>
      <Route path="/about">
        <AboutComponent fallback={<Loading />} />
      </Route>
      <Route exact path="/">
        <HomeComponent fallback={<Loading />} />
      </Route>
    </Switch>
  </Layout>
);

const RootRoutes: FC = () => <Route component={Routes} />;

export default RootRoutes;
