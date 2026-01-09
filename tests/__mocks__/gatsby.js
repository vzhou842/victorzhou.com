'use strict';

const React = require('react');
const gatsby = jest.requireActual('gatsby');

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest
    .fn()
    .mockImplementation(({ to, ...props }) => React.createElement('a', { href: to, ...props })),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
};
