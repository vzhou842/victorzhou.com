import React from 'react';
import renderer from 'react-test-renderer';

import Pagination from './Pagination';

describe('Pagination', () => {
  const props = {
    currentPage: 2,
    pagePath: p => `/test/${p}`,
    hasNextPage: true,
    hasPrevPage: true,
    numPages: 5,
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Pagination {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
