import loadable from '@loadable/component';

const HomeComponent = loadable(() => import(/* webpackChunkName: "home" */ './components'));

export default HomeComponent;
