import React from 'react';
import renderer from 'react-test-renderer';
import Discuss from './Discuss';

describe('Discuss', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Discuss
          twitter="https://twitter.com"
          hn="https://news.ycombinator.com"
          reddit="https://reddit.com"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
