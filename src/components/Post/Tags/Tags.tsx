import { Link } from 'gatsby';
import React from 'react';

import styles from './Tags.module.scss';

interface Props {
  tags: string[];
  tagSlugs?: string[];
}

const Tags = ({ tags, tagSlugs }: Props) => {

  return (
    <div className={styles['tags']}>
      <ul className={styles['tags__list']}>
        <li className={styles['tags__list-title']}>
          <h4 className={styles['tags__title']}>Tags:</h4>
        </li>
        {tagSlugs?.map((slug, i) => (
          <li className={styles['tags__list-item']} key={tags[i]}>
            <Link to={slug} className={styles['tags__list-item-link']}>
              {tags[i]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
