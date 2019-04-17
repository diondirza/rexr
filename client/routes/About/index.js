import Loadable from 'react-loadable';

import Loading from '@components/Loading';

const HomeComponent = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ '@routes/About/components'),
  loading: Loading,
});

export default HomeComponent;
