// @flow
import React from 'react';
import { Link } from 'gatsby';
import styles from './Feed.module.scss';
import { renderDate } from '../../utils/date';
import GuestAuthor from '../GuestAuthor';

type Props = {|
  +edges: Array<Object>,
  +shortened?: boolean,
|};

const Feed = ({ edges, shortened }: Props) => (
  <div className={styles['feed']}>
    {edges.map(edge => {
      const {
        fields: { categorySlug, slug },
        frontmatter: { date, title, category, description, isSeries, guestAuthor, guestAuthorLink },
      } = edge.node;

      const dateElement = renderDate(date);

      return (
        <div className={styles['feed__item']} key={slug}>
          <h2 className={styles['feed__item-title']}>
            <Link className={styles['feed__item-title-link']} to={slug}>
              {title}
            </Link>
          </h2>
          <div className={styles['feed__item-meta']}>
            <time className={styles['feed__item-meta-time']} dateTime={date}>
              {dateElement}
            </time>
            <span className={styles['feed__item-meta-divider']} />
            <span className={styles['feed__item-meta-category']}>
              <Link to={categorySlug} className={styles['feed__item-meta-category-link']}>
                {category}
              </Link>
            </span>
          </div>
          {!!guestAuthor && (
            <GuestAuthor author={guestAuthor} link={guestAuthorLink} />
          )}
          {!shortened && (
            <>
              <p className={styles['feed__item-description']}>{description}</p>
              <Link className={styles['feed__item-readmore']} to={slug}>
                {isSeries ? 'View Series' : 'Read'}
              </Link>
            </>
          )}
        </div>
      );
    })}
  </div>
);

export default Feed;
