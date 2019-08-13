// @flow
import * as React from 'react';
import styles from './Content.module.scss';
import ContentDate from '../ContentDate';
import CarbonAd from '../CarbonAd';

type Props = {|
  +body: string,
  +title: string,
  +subtitle: ?string,
  +date: Date,
  +dateModified: ?Date,
  +footer: ?React.Node,
|};

const Content = ({ body, title, subtitle, date, dateModified, footer }: Props) => (
  <article className={styles['content']}>
    <h1 className={`${styles['content__title']} ${subtitle ? '' : styles['no-subtitle']}`}>
      {title}
    </h1>
    {subtitle && <h2 className={styles['content__subtitle']}>{subtitle}</h2>}
    <div className={styles['content__date']}>
      <ContentDate date={date} dateModified={dateModified} />
    </div>
    <CarbonAd smallOnly />
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
    {footer}
  </article>
);

export default Content;
