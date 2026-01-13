import React from 'react';
import renderer from 'react-test-renderer';

import Content from './Content';

describe('Content', () => {
  it('renders correctly', () => {
    const props = {
      title: 'test',
      htmlAst: { type: 'root', children: [] },
      dateFormatted: 'February 4, 2019',
    };

    const tree = renderer.create(<Content {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
