import React from 'react';
import renderer from 'react-test-renderer';
import Series from './Series';

describe('Series', () => {
  const props = {
    frontmatter: {},
    html: '<div></div>',
    htmlEnd: '<div></div>',
    seriesPosts: {
      edges: [{
        node: {
          frontmatter: {
            title: 'test',
            date: new Date('01-01-19'),
          },
        },
      }],
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Series {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
