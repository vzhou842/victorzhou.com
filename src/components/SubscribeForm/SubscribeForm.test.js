import React from 'react';
import renderer from 'react-test-renderer';
import SubscribeForm from './SubscribeForm';

describe('SubscribeForm', () => {
  it('renders default correctly', () => {
    const tree = renderer.create(<SubscribeForm signupSource="test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders large correctly', () => {
    const tree = renderer.create(<SubscribeForm signupSource="test" large />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
