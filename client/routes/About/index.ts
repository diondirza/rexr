import loadable from '@loadable/component';

const AboutComponent = loadable(() => import(/* webpackChunkName: "about" */ './components'));

export default AboutComponent;
