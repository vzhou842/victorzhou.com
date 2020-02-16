import React from 'react';
import styles from './Page.module.scss';

const Page = ({ title, subtitle, description, children }) => (
  <div className={styles['page']}>
    <div className={styles['page__inner']}>
      {title && (
        <h1 className={`${styles['page__title']} ${subtitle ? styles['with-subtitle'] : ''}`}>
          {title}
        </h1>
      )}
      {subtitle && <h2 className={styles['page__subtitle']}>{subtitle}</h2>}
      {description && <div className={styles['page__description']}>{description}</div>}
      <div className={styles['page__body']}>{children}</div>
    </div>
  </div>
);

export default Page;
