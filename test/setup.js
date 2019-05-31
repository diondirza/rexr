import { matchers } from 'jest-emotion';
import { configure } from '@testing-library/react';

import config from '@config';
import constants from '@constants';
import { gitRevision, isDev, isProd, isVerbose } from '../utils';

configure({ testIdAttribute: 'data-tid' });

// Below are globals config from webpack define plugin
global.constants = {
  ...constants,
};
global.publicPath = config.get('PUBLIC_PATH');
global.__DEV__ = isDev;
global.__PROD__ = isProd;
global.__CLIENT__ = true;
global.__SERVER__ = false;
global.__DEVTOOLS__ = false;
global.__SERVER__ = isVerbose;
global.__GITREV__ = gitRevision;

expect.extend(matchers);
