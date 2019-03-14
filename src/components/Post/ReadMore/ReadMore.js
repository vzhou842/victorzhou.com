import React from 'react';
import moment from 'moment';
import styles from './ReadMore.module.scss';

const ReadMoreLink = ({ post: { frontmatter: { date, description, slug, title } } }) => (
  <div>
    <a href={slug}><b>{title}</b></a>
    <p><b>{moment(date).format('MMMM D, YYYY')}</b></p>
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
