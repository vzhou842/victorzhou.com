import React from 'react';
import renderer from 'react-test-renderer';
import Post from './Post';

const post = {
  html: '<p>test</p>',
  fields: {
    tagSlugs: ['/test_0', '/test_1'],
  },
  frontmatter: {
    date: new Date('2019-03-14T12:00:00.000Z'),
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
