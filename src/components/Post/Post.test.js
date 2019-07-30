import React from 'react';
import renderer from 'react-test-renderer';
import Post from './Post';

const post = {
  html: '<p>test</p>',
  fields: {
    tagSlugs: ['/test_0', '/test_1'],
  },
  frontmatter: {
    date: new Date('01-01-19'),
    slug: 'test',
    tags: ['test_0', 'test_1'],
    title: 'test',
    description: 'test',
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
