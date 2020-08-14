import React from 'react';
import renderer from 'react-test-renderer';

import Pagination from './Pagination';

describe('Pagination', () => {
  const props = {
    pagePath: p => `/test/${p}`,
    hasNextPage: true,
    hasPrevPage: true,
  };

  it('renders correctly on page 2 / 5', () => {
    const tree = renderer.create(<Pagination {...props} currentPage={2} numPages={5} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly on page 6 / 10', () => {
    const tree = renderer.create(<Pagination {...props} currentPage={6} numPages={10} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
