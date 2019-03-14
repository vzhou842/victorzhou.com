import React from 'react';
import renderer from 'react-test-renderer';
import Post from './Post';

const post = () => ({
  html: '<p>test</p>',
  fields: {
    tagSlugs: ['/test_0', '/test_1'],
  },
  frontmatter: {
    date: '2016-09-01',
    slug: 'test',
    tags: ['test_0', 'test_1'],
    title: 'test',
  },
});

describe('Post', () => {
  const props = {
    post: post(),
    prevPost: post(),
    nextPost: post(),
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Post {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
