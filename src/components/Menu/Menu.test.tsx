import React from 'react';
import renderer from 'react-test-renderer';

import { PureMenu as Menu } from './Menu';

describe('Menu', () => {
  const props = {
    data: {
      site: {
        siteMetadata: {
          menu: [
            {
              label: 'Item 0',
              path: '/#0/',
            },
            {
              label: 'Item 1',
              path: '/#1/',
            },
          ],
        },
      },
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Menu {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
