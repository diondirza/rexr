module.exports = {
  collectCoverageFrom: ['client/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
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
  moduleDirectories: ['node_modules', 'test'],
  moduleNameMapper: {
    '^@/': '<rootDir>/client$1',
    '^@components(.*)$': '<rootDir>/client/components$1',
    '^@config$': '<rootDir>/config/index',
    '^@constants$': '<rootDir>/constants/index',
    '^@context(.*)$': '<rootDir>/client/context$1',
    '^@context$': '<rootDir>/client/context/index',
    '^@helpers(.*)$': '<rootDir>/client/helpers$1',
    '^@hooks(.*)$': '<rootDir>/client/hooks$1',
    '^@routes(.*)$': '<rootDir>/client/routes$1',
    '^@styles(.*)$': '<rootDir>/client/styles$1',
  },
  setupFilesAfterEnv: ['jest-dom/extend-expect', '<rootDir>/test/setup.js', 'react-testing-library/cleanup-after-each'],
  testEnvironment: 'jest-environment-jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
    //   '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //     '<rootDir>/test/assetsTransformer.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.((j|t)sx?|mjs)$'],
};
