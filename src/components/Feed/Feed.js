import React from 'react';
import { Link } from 'gatsby';
import styles from './Feed.module.scss';
import { renderDate } from '../../utils/date';

const Feed = ({ edges }) => (
  <div className={styles['feed']}>
    {edges.map(edge => {
      const {
        fields: { categorySlug, slug },
        frontmatter,
      } = edge.node;
      const date = renderDate(frontmatter.date);

      return (
        <div className={styles['feed__item']} key={slug}>
          <h2 className={styles['feed__item-title']}>
            <Link className={styles['feed__item-title-link']} to={slug}>
              {frontmatter.title}
            </Link>
          </h2>
          <div className={styles['feed__item-meta']}>
            <time className={styles['feed__item-meta-time']} dateTime={date}>
              {date}
            </time>
            <span className={styles['feed__item-meta-divider']} />
            <span className={styles['feed__item-meta-category']}>
              <Link to={categorySlug} className={styles['feed__item-meta-category-link']}>
                {frontmatter.category}
              </Link>
            </span>
          </div>
          <p className={styles['feed__item-description']}>{frontmatter.description}</p>
          <Link className={styles['feed__item-readmore']} to={slug}>
            Read
          </Link>
        </div>
      );
    })}
  </div>
);

export default Feed;
