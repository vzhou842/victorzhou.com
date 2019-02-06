import React from 'react';
import renderer from 'react-test-renderer';
import SubscribeForm from './SubscribeForm';

describe('SubscribeForm', () => {
  it('renders default correctly', () => {
    const tree = renderer.create(<SubscribeForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders large correctly', () => {
    const tree = renderer.create(<SubscribeForm large />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
