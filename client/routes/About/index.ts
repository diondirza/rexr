import { lazy } from '@loadable/component';

const AboutComponent = lazy(() => import(/* webpackChunkName: "about" */ './components'));

export default AboutComponent;
