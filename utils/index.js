const git = require('git-rev-sync');
const { ifElse } = require('./logic');

const gitRevision = JSON.stringify(git.long());

const isCircleCI = process.env.CIRCLECI === 'true' || process.env.CIRCLE_CI === 'true';
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const ifCircleCI = ifElse(isCircleCI);
const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);

module.exports = {
  gitRevision,
  ifCircleCI,
  ifDev,
  ifProd,
  isCircleCI,
  isDev,
  isProd,
};
