import React from 'react';
import renderer from 'react-test-renderer';
import PostTemplate from './post-template';

const edge = (slug, prev, next) => ({
  node: {
    html: '<p>test</p>',
    fields: {
      tagSlugs: ['/test_0', '/test_1'],
    },
    frontmatter: {
      date: '2016-09-01',
      description: 'test',
      slug,
      prev,
      next,
      title: 'test',
      tags: ['test_0', 'test_1'],
    },
  },
});

const slug = 'test';
const prev = 'test-prev';
const next = 'test-next';

describe('PostTemplate', () => {
  const props = {
    data: {
      site: {
        siteMetadata: {
          title: 'test',
          subtitle: 'test',
          author: {
            name: 'test',
            photo: '/test.png',
          },
        },
      },
      allMarkdownRemark: {
        edges: [
          edge(slug, prev, next),
          edge(prev, slug, next),
          edge(next, prev, slug),
        ],
      },
    },
  };

  it('renders correctly', () => {
    const tree = renderer
      .create(<PostTemplate {...props} pageContext={{ slug, prev, next }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
