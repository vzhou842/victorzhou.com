import React from 'react';
import renderer from 'react-test-renderer';
import SubscribeForm from './SubscribeForm';

describe('SubscribeForm', () => {
  it('renders correctly', () => {
    const props = {};

    const tree = renderer.create(<SubscribeForm {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
