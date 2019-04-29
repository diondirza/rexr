import Loadable from 'react-loadable';

import Loading from '@components/Loading';

const HomeComponent = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ '@routes/Home/components'),
  loading: Loading,
});

export default HomeComponent;
