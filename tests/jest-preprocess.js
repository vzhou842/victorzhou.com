'use strict';

const babelOptions = {
  presets: [
    '@babel/react',
    [
      '@babel/preset-env',
      // https://github.com/facebook/jest/issues/3126
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-flow-strip-types',
  ],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
