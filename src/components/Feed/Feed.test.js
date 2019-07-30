import React from 'react';
import renderer from 'react-test-renderer';
import Feed from './Feed';

const edge = s => ({
  node: {
    fields: {
      slug: s,
      categorySlug: s,
    },
    frontmatter: {
      date: new Date('01-01-19'),
      description: s,
      category: s,
      title: s,
    }
  }
});

describe('Feed', () => {
  const props = {
    edges: [
      edge('test_0'),
      edge('test_1'),
    ],
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Feed {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
