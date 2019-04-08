import React from 'react';
import Loadable from 'react-loadable';

const HomeComponent = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ '@routes/Home/components'),
  // eslint-disable-next-line react/prop-types
  loading: ({ error }) => {
    if (error) throw error;

    return <div>Loading ...</div>;
  },
});

export default HomeComponent;
