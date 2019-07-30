// @flow
import React from 'react';
import styles from './SeriesPost.module.scss';
import ContentDate from '../../ContentDate';

type Props = {|
  +date: string,
  +dateModified: string,
  +description: string,
  +img: string,
  +n: number,
  +slug: string,
  +title: string,
|};

const SeriesPost = ({ date, dateModified, description, img, n, slug, title }: Props) => (
  <div className={styles['series-post']}>
    <a href={slug}>
      <img src={img} />
    </a>
    <div>
      <h3>
        <a href={slug}>{`${n}. ${title}`}</a>
      </h3>
      <ContentDate date={date} dateModified={dateModified} />
      <p>{description}</p>
    </div>
  </div>
);

export default SeriesPost;
