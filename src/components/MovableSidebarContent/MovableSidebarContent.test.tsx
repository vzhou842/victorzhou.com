import React from 'react';
import renderer from 'react-test-renderer';

import { PureMovableSidebarContent as MovableSidebarContent } from './MovableSidebarContent';

describe('MovableSidebarContent', () => {
  it('renders correctly', () => {
    const props = {
      data: {
        site: {
          siteMetadata: {
            author: {
              contacts: {
                email: '#',
                twitter: '#',
                github: '#',
              },
            },
            copyright: 'copyright',
          },
        },
      },
    };

    const tree = renderer.create(<MovableSidebarContent {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
