import React from 'react';
import Pagination from '../../Pagination';
import styles from './ReadMore.module.scss';

const ReadMore = ({ prev, next }) => (
  <div className={styles['readmore']}>
    <h4 className={styles['readmore-title']}>READ MORE</h4>
    <Pagination
      classes={styles['readmore-pagination']}
      prevPagePath={prev}
      nextPagePath={next}
      hasPrevPage
      hasNextPage
    />
  </div>
);

export default ReadMore;
