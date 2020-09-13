import { lazy } from '@loadable/component';

const HomeComponent = lazy(() => import(/* webpackChunkName: "home" */ './components'));

export default HomeComponent;
