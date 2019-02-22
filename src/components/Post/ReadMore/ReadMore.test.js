import React from 'react';
import renderer from 'react-test-renderer';
import ReadMore from './ReadMore';

describe('ReadMore', () => {
  it('renders correctly', () => {
    const props = {
      next: '/',
      prev: '/',
    };

    const tree = renderer.create(<ReadMore {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
