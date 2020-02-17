// @flow
import { graphql, Link } from 'gatsby';
import React from 'react';

import GuestAuthor from '../GuestAuthor';
import styles from './Feed.module.scss';

type Props = {|
  +edges: Array<Object>,
  +shortened?: boolean,
|};

const Feed = ({ edges, shortened }: Props) => (
  <div className={styles['feed']}>
    {edges.map(edge => {
      const {
        fields: { categorySlug, slug, dateFormatted },
        frontmatter: {
          date,
          title,
          category,
          description,
          isSeries,
          guestAuthor,
          guestCoAuthor,
          guestAuthorLink,
        },
      } = edge.node;

      return (
        <div className={styles['feed__item']} key={slug}>
          <h2 className={styles['feed__item-title']}>
            <Link className={styles['feed__item-title-link']} to={slug}>
              {title}
            </Link>
          </h2>
          <div className={styles['feed__item-meta']}>
            <time className={styles['feed__item-meta-time']} dateTime={date}>
              {dateFormatted}
            </time>
            <span className={styles['feed__item-meta-divider']} />
            <span className={styles['feed__item-meta-category']}>
              <Link to={categorySlug} className={styles['feed__item-meta-category-link']}>
                {category}
              </Link>
            </span>
          </div>
          <GuestAuthor author={guestAuthor} coAuthor={guestCoAuthor} link={guestAuthorLink} />
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

export const fragment = graphql`
  fragment FeedFragment on MarkdownRemarkEdge {
    node {
      fields {
        categorySlug
        slug
        dateFormatted
      }
      frontmatter {
        date
        title
        category
        description
        isSeries
        guestAuthor
        guestCoAuthor
        guestAuthorLink
      }
    }
  }
`;

export default Feed;
