// @flow
import { Link } from 'gatsby';
import React from 'react';

import ContentDate from '../../ContentDate';
import styles from './SeriesPost.module.scss';

type Props = {|
  +dateFormatted: string,
  +dateModifiedFormatted?: string,
  +description: string,
  +img: string,
  +n: number,
  +slug: string,
  +title: string,
|};

const SeriesPost = ({
  dateFormatted,
  dateModifiedFormatted,
  description,
  img,
  n,
  slug,
  title,
}: Props) => (
  <div className={styles['series-post']}>
    <div className={styles['series-post-content']}>
      <Link to={slug}>
        <img src={img} alt={title} loading="lazy" />
      </Link>
      <div>
        <h3>
          <Link to={slug}>{`${n}. ${title}`}</Link>
        </h3>
        <ContentDate dateFormatted={dateFormatted} dateModifiedFormatted={dateModifiedFormatted} />
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default SeriesPost;
