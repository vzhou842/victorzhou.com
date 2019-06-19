import React from 'react';
import styles from './Content.module.scss';
import { renderDate } from '../../../utils/date';

const dateToTime = date => <time>{renderDate(date)}</time>;

const Content = ({ body, title, subtitle, date, dateModified }) => (
  <article className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <h2 className={styles['content__subtitle']}>{subtitle}</h2>
    <p className={styles['content__date']}>
      {dateToTime(date)}
      {dateModified && (
        <span className={styles['date-modified']}>
          &ensp;|&ensp;UPDATED {dateToTime(dateModified)}
        </span>
      )}
    </p>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </article>
);

export default Content;
