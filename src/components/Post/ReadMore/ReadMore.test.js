import React from 'react';
import renderer from 'react-test-renderer';
import ReadMore from './ReadMore';

const post = () => ({
  frontmatter: { date: new Date('2019-03-14T12:00:00.000Z') },
});

describe('ReadMore', () => {
  it('renders correctly', () => {
    const props = {
      nextPost: post(),
      prevPost: post(),
    };

    const tree = renderer.create(<ReadMore {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
