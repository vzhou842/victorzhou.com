import React from 'react';
import moment from 'moment';
import styles from './Content.module.scss';

const Content = ({ body, title, subtitle, date }) => (
  <article className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <h2 className={styles['content__subtitle']}>{subtitle}</h2>
    <p className={styles['content__date']}><time>{moment(date).format('MMMM DD, YYYY')}</time></p>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </article>
);

export default Content;
