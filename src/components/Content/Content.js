import React from 'react';
import styles from './Content.module.scss';
import ContentDate from '../ContentDate';

const Content = ({ body, title, subtitle, date, dateModified }) => (
  <article className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <h2 className={styles['content__subtitle']}>{subtitle}</h2>
    <div className={styles['content__date']}>
      <ContentDate date={date} dateModified={dateModified} />
    </div>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </article>
);

export default Content;
