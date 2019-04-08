import * as emotion from 'emotion';
import { createSerializer } from 'jest-emotion';

import config from '@config';
import constants from '@constants';
import { gitRevision, isDev, isProd, isVerbose } from '../utils';
import setupComponentHelper from './setupComponentHelper';

// Below are globals config from webpack define plugin
global.globals = {
  ...constants.app,
  ...constants.globals,
  CookieSID: config.get('COOKIE.SESSION_ID'),
};
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
// ====

// Helper functions
global.setupComponent = setupComponentHelper;

expect.addSnapshotSerializer(createSerializer(emotion));
