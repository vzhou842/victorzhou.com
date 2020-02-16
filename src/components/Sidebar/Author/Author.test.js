import React from 'react';
import renderer from 'react-test-renderer';

import Author from './Author';

describe('Author', () => {
  const props = {
    author: {
      name: 'test',
      photo: '/photo2.png',
      bio: 'test',
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Author {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
