import classNames from 'classnames/bind';
import { Link } from 'gatsby';
import React from 'react';

import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

const PAGINATE_RANGE = 2;

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

  const pageNumbers = [];
  const min = currentPage - PAGINATE_RANGE;
  const max = currentPage + PAGINATE_RANGE;
  for (let i = min; i <= max; i++) {
    if (i >= 1 && i <= numPages) {
      pageNumbers.push(i);
    }
  }

  if (min <= 1 && max < numPages) {
    // 1 2 … n
    if (max < numPages - 1) {
      pageNumbers.push('…');
    }
    pageNumbers.push(numPages);
  } else if (max >= numPages && min > 1) {
    // 1 … (n-1) n
    if (min > 2) {
      pageNumbers.unshift('…');
    }
    pageNumbers.unshift(1);
  } else if (min > 1 && max < numPages) {
    // … (k-1) k (k+1) …
    pageNumbers.unshift(min > 2 ? '…' : 1);
    pageNumbers.push(max < numPages - 1 ? '…' : numPages);
  }

  return (
    <div className={`${styles['pagination']} ${classes || ''}`}>
      <div className={styles['pagination__prev']}>
        <Link rel="prev" to={pagePath(currentPage - 1)} className={prevClassName}>
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
        <Link rel="next" to={pagePath(currentPage + 1)} className={nextClassName}>
          NEXT →
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
