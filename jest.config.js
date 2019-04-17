module.exports = {
  collectCoverageFrom: ['<rootDir>/client/**/*.{js,jsx}'],
  resetMocks: true,
  verbose: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js',
  transform: {
    '^.+\\.(jsx?)$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/assetsTransformer.js',
  },
  moduleNameMapper: {
    '^@/': '<rootDir>/client$1',
    '^@context(.*)$': '<rootDir>/client/context$1',
    '^@components(.*)$': '<rootDir>/client/components$1',
    '^@helpers(.*)$': '<rootDir>/client/helpers$1',
    '^@routes(.*)$': '<rootDir>/client/routes$1',
    '^@hooks(.*)$': '<rootDir>/client/hooks$1',
    '^@styles(.*)$': '<rootDir>/client/styles$1',
  },
  testMatch: ['<rootDir>/client/**/__tests__/**/*.{js,jsx}', '<rootDir>/client/**/?(*.)(spec|test).{js,jsx}'],
  transformIgnorePatterns: [
    '<rootDir>/[/\\\\]node_modules[/\\\\].+\\.(jsx?)$',
    '[/\\\\]node_modules[/\\\\].+\\.(jsx?)$',
  ],
  testEnvironment: 'node',
};
