import React from 'react';
import renderer from 'react-test-renderer';

import ReadMore from './ReadMore';

const post = () => ({
  fields: { dateFormatted: 'March 14, 2019' },
  frontmatter: {
    description: 'test description',
    img: '/test-img.png',
    slug: '/test-slug/',
    title: 'Test Title',
  },
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
