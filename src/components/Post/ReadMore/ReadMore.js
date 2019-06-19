import React from 'react';
import styles from './ReadMore.module.scss';
import { renderDate } from '../../../utils/date';

const ReadMoreLink = ({
  post: {
    frontmatter: { date, dateModified, description, slug, title },
  },
}) => (
  <div>
    <a href={slug}>
      <b>{title}</b>
    </a>
    <p>
      <b>{renderDate(dateModified || date)}</b>
    </p>
    <p>{description}</p>
  </div>
);

const ReadMore = ({ prevPost, nextPost }) => (
  <div className={styles['readmore']}>
    <h4 className={styles['readmore-title']}>YOU MIGHT ALSO LIKE</h4>
    <div className={styles['readmore-links']}>
      <ReadMoreLink post={prevPost} />
      <ReadMoreLink post={nextPost} />
    </div>
  </div>
);

export default ReadMore;
