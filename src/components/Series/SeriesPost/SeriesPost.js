// @flow
import React from 'react';
import { Link } from 'gatsby';
import styles from './SeriesPost.module.scss';
import ContentDate from '../../ContentDate';

type Props = {|
  +date: Date,
  +dateModified?: Date,
  +description: string,
  +img: string,
  +n: number,
  +slug: string,
  +title: string,
|};

const SeriesPost = ({ date, dateModified, description, img, n, slug, title }: Props) => (
  <div className={styles['series-post']}>
    <div className={styles['series-post-content']}>
      <Link to={slug}>
        <img src={img} />
      </Link>
      <div>
        <h3>
          <Link to={slug}>{`${n}. ${title}`}</Link>
        </h3>
        <ContentDate date={date} dateModified={dateModified} />
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default SeriesPost;
