import React from 'react';
import renderer from 'react-test-renderer';
import SubscriberThankYouTemplate from './subscriber-thank-you-template';

describe('SubscriberThankYouTemplate', () => {
  const props = {
    data: {
      site: {
        siteMetadata: {
          title: 'test',
          url: 'test',
        },
      },
    },
  };

  it('renders correctly', () => {
    const tree = renderer.create(<SubscriberThankYouTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
