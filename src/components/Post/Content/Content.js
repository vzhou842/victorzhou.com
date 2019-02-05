import React from 'react';
import styles from './Content.module.scss';

const Content = ({ body, title, subtitle }) => (
  <div className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <h2 className={styles['content__subtitle']}>{subtitle}</h2>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
