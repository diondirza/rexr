const path = require('path');
const appRootDir = require('app-root-dir');

function initEnvironmentConstants() {
  const { BUILD_ENV = '', NODE_ENV = '' } = process.env;
  const basePath = path.resolve(appRootDir.get(), 'constants');
  let values = {};
  let defaultConstants = {};
  let envConstants = {};

  try {
    console.log(`Loading constant file at ${basePath} ...; BUILD_ENV: ${BUILD_ENV}, NODE_ENV: ${NODE_ENV}`);
    defaultConstants = require(`${basePath}/default`).default;
    envConstants = require(`${basePath}/${BUILD_ENV || NODE_ENV}`).default;
  } catch (e) {
    console.log('No constants file in service folder to load');
  } finally {
    values = {
      ...defaultConstants,
      ...envConstants,
    };
  }

  return values;
}

const constants = initEnvironmentConstants();

module.exports = constants;
