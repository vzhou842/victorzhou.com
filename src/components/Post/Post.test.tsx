import React from 'react';
import renderer from 'react-test-renderer';

import Post from './Post';

const post = {
  htmlAst: { type: 'root', children: [] },
  fields: {
    tagSlugs: ['/test_0', '/test_1'],
    dateFormatted: 'March 14, 2019',
  },
  frontmatter: {
    slug: '/test/',
    tags: ['test_0', 'test_1'],
    title: 'test',
    description: 'test',
    img: '/test.png',
    isML: false,
    isWeb: true,
  },
};

describe('Post', () => {
  const props = {
    post,
    prevPost: post,
    nextPost: post,
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Post {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
