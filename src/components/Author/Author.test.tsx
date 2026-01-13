import React from 'react';
import renderer from 'react-test-renderer';

import { PureAuthor as Author } from './Author';

describe('Author', () => {
  it('renders correctly', () => {
    const props = {
      author: {
        name: 'test',
        bio: 'test',
        photo: 'test',
      },
    };

    const tree = renderer.create(<Author {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
