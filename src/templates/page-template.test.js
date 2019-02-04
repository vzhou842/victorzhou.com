import React from 'react';
import renderer from 'react-test-renderer';
import PageTemplate from './page-template';

describe('PageTemplate', () => {
  const props = {
    data: {
      markdownRemark: {
        html: '<p>test</p>',
        frontmatter: {
          title: 'test',
          description: 'test'
        }
      },
      site: {
        siteMetadata: {
          title: 'test',
          subtitle: 'test'
        }
      }
    }
  };

  it('renders correctly', () => {
    const tree = renderer.create(<PageTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
