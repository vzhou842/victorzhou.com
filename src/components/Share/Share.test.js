import React from 'react';
import renderer from 'react-test-renderer';
import { Share } from './Share';

describe('Share', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Share url="/test" title="Test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
