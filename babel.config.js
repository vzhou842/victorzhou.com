module.exports = {
  presets: [
    [
      'babel-preset-gatsby',
      {
        reactRuntime: 'automatic',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-flow-strip-types'],
};
