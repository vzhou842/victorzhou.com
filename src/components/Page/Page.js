// @flow
import classnames from 'classnames/bind';
import * as React from 'react';

import styles from './Page.module.scss';

const cx = classnames.bind(styles);

type Props = $ReadOnly<{|
  title?: string,
  subtitle?: React.Node,
  meta?: React.Node,
  description?: React.Node,
  children?: React.Node,
|}>;

const Page = ({ title, subtitle, meta, description, children }: Props) => (
  <div className={styles['page']}>
    <div className={styles['page__inner']}>
      {title && (
        <h1
          className={cx({
            page__title: true,
            'with-subtitle': !!subtitle,
            'with-meta': !!meta,
          })}
        >
          {title}
        </h1>
      )}
      {subtitle && <h2 className={styles['page__subtitle']}>{subtitle}</h2>}
      {meta && <div className={styles['page__meta']}>{meta}</div>}
      {description && <div className={styles['page__description']}>{description}</div>}
      <div className={styles['page__body']}>{children}</div>
    </div>
  </div>
);

export default Page;
