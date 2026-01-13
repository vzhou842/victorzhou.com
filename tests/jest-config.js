'use strict';

module.exports = {
  rootDir: '../',
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/tests/jest-preprocess.js',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)test.[jt]s?(x)'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['node_modules', '.cache', 'public'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby|gatsby-script|gatsby-link|github-slugger)/)'],
  globals: {
    __PATH_PREFIX__: '',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
