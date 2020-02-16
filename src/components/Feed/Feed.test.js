import React from 'react';
import renderer from 'react-test-renderer';

import Feed from './Feed';

const edge = s => ({
  node: {
    fields: {
      slug: s,
      categorySlug: s,
      dateFormatted: 'March 14, 2019',
    },
    frontmatter: {
      date: new Date('2019-03-14T12:00:00.000Z'),
      description: s,
      category: s,
      title: s,
    },
  },
});

describe('Feed', () => {
  const props = {
    edges: [edge('test_0'), edge('test_1')],
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Feed {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
