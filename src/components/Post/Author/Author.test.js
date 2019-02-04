import React from 'react';
import renderer from 'react-test-renderer';
import { PureAuthor as Author } from './Author';

describe('Author', () => {
  it('renders correctly', () => {
    const props = {
      data: {
        site: {
          siteMetadata: {
            author: {
              name: 'test',
              bio: 'test',
              contacts: {
                twitter: 'test'
              }
            }
          }
        }
      }
    };

    const tree = renderer.create(<Author {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
