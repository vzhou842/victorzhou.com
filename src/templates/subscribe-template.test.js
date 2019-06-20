import React from 'react';
import renderer from 'react-test-renderer';
import SubscriberTemplate from './subscribe-template';

describe('SubscriberTemplate', () => {
  const props = {
    data: {
      site: {
        siteMetadata: {
          title: 'test',
        },
      },
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<SubscriberTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
