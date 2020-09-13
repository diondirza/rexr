import loadable from '@loadable/component';

import Loading from '@components/Loading';

const HomeComponent = loadable(() => import(/* webpackChunkName: "home" */ './components'), {
  // @ts-ignore
  fallback: Loading,
});

export default HomeComponent;
