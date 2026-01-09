'use strict';

const babelOptions = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};

module.exports = require('babel-jest').default.createTransformer(babelOptions);
