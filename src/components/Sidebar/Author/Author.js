import { Link, withPrefix } from 'gatsby';
import React from 'react';

import DarkModeToggle from '../../DarkModeToggle';
import styles from './Author.module.scss';

const Author = ({ author }) => (
  <div className={styles['author']}>
    <div className={styles['author__main-section']}>
      <Link to="/">
        <img src={withPrefix(author.photo)} className={styles['author__photo']} alt={author.name} />
      </Link>
      <div className={styles['author__title']}>
        <h1>
          <Link className={styles['author__title-link']} to="/">
            {author.name}
          </Link>
        </h1>
        <DarkModeToggle />
      </div>
    </div>
    <p className={styles['author__subtitle']} dangerouslySetInnerHTML={{ __html: author.bio }} />
  </div>
);

export default Author;
