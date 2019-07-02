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
    pageContext: {
      updateSubscription: false,
    },
  };

  it('renders correctly when updateSubscription is false', () => {
    const tree = renderer.create(<SubscriberTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when updateSubscription is true', () => {
    const tree = renderer.create(
      <SubscriberTemplate {...{ ...props, pageContext: { updateSubscription: true } }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
