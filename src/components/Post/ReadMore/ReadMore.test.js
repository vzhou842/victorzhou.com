import React from 'react';
import renderer from 'react-test-renderer';

import ReadMore from './ReadMore';

const post = () => ({
  fields: { dateFormatted: 'March 14, 2019' },
  frontmatter: {},
});

describe('ReadMore', () => {
  it('renders correctly', () => {
    const props = {
      nextPost: post(),
      prevPost: post(),
    };

    const tree = renderer.create(<ReadMore {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
