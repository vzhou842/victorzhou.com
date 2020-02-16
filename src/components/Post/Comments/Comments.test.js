import React from 'react';
import renderer from 'react-test-renderer';

import Comments from './Comments';

describe('Comments', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Comments />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
