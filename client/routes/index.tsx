import React, { FC, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '@components/Layout';
import Loading from '@components/Loading';

// #region import routes
import HomeComponent from '@routes/Home';
import AboutComponent from '@routes/About';
// #endregion

const Routes: FC = () => (
  <Layout>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route component={AboutComponent} path="/about" />
        <Route exact component={HomeComponent} path="/" />
      </Switch>
    </Suspense>
  </Layout>
);

const RootRoutes: FC = () => <Route component={Routes} />;

export default RootRoutes;
