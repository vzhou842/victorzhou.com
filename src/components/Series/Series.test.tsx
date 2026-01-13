import React from 'react';
import renderer from 'react-test-renderer';

import Series from './Series';

describe('Series', () => {
  const props = {
    htmlEnd: '<div></div>',
    series: {
      fields: {
        dateFormatted: 'March 14, 2019',
      },
      frontmatter: {
        slug: '/test/',
        title: 'test',
        description: 'test description',
        isML: false,
        isWeb: true,
        img: '/test.png',
        seriesSlugs: ['/post-1/', '/post-2/'],
      },
      htmlAst: { type: 'root', children: [] },
    },
    seriesPosts: {
      edges: [
        {
          node: {
            fields: {
              dateFormatted: 'March 14, 2019',
            },
            frontmatter: {
              title: 'Post 1',
              description: 'Description 1',
              img: '/img1.png',
              slug: '/post-1/',
            },
          },
        },
      ],
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Series {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
