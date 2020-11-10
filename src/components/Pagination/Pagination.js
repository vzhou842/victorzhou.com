import classNames from 'classnames/bind';
import { Link } from 'gatsby';
import React from 'react';

import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

const Pagination = ({ classes, currentPage, pagePath, hasNextPage, hasPrevPage, numPages }) => {
  if (!hasNextPage && !hasPrevPage) {
    return null;
  }

  const prevClassName = cx({
    'pagination__prev-link': true,
    'pagination__prev-link--disable': !hasPrevPage,
  });

  const nextClassName = cx({
    'pagination__next-link': true,
    'pagination__next-link--disable': !hasNextPage,
  });

  let pageNumbers = [];

  // If there are <= 7 pages, we'll never need an ellipsis.
  if (numPages <= 7) {
    for (let i = 1; i <= numPages; i++) {
      pageNumbers.push(i);
    }
  } else if (currentPage <= 4) {
    // 1 2 3 4 5 ... n
    pageNumbers = [1, 2, 3, 4, 5, '…', numPages];
  } else if (currentPage < numPages - 3) {
    // 1 ... c-1 c c+1 ... n
    pageNumbers = [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', numPages];
  } else {
    // 1 ... n-4 n-3 n-2 n-1 n
    pageNumbers = [1, '…', numPages - 4, numPages - 3, numPages - 2, numPages - 1, numPages];
  }

  return (
    <div className={`${styles['pagination']} ${classes || ''}`}>
      <div className={styles['pagination__prev']}>
        <Link
          rel="prev"
          to={hasPrevPage ? pagePath(currentPage - 1) : '/#'}
          className={prevClassName}
        >
          ← PREV
        </Link>
      </div>
      <ul className={styles['pagination__list-container']}>
        {pageNumbers.map((pn, i) => (
          <li key={`pagenum-${i}`}>
            {pn === '…' ? (
              <p>…</p>
            ) : (
              <Link to={pagePath(pn)} className={pn === currentPage ? styles['selected'] : ''}>
                {pn}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className={styles['pagination__next']}>
        <Link
          rel="next"
          to={hasNextPage ? pagePath(currentPage + 1) : '/#'}
          className={nextClassName}
        >
          NEXT →
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
