// @flow
import * as React from 'react';
import loadable from '@loadable/component';
import styles from './Content.module.scss';
import ContentDate from '../ContentDate';
import GuestAuthor from '../GuestAuthor';

const CarbonAd = loadable(() => import('../CarbonAd'));

type Props = {|
  +body: string,
  +title: string,
  +subtitle: ?string,
  +dateFormatted: string,
  +dateModifiedFormatted: ?string,
  +footer: ?React.Node,
  +guestAuthor: ?string,
  +guestCoAuthor?: ?boolean,
  +guestAuthorLink: ?string,
|};

const Content = ({
  body,
  title,
  subtitle,
  dateFormatted,
  dateModifiedFormatted,
  footer,
  guestAuthor,
  guestCoAuthor,
  guestAuthorLink,
}: Props) => (
  <article className={styles['content']}>
    <h1 className={`${styles['content__title']} ${subtitle ? '' : styles['no-subtitle']}`}>
      {title}
    </h1>
    {subtitle && <h2 className={styles['content__subtitle']}>{subtitle}</h2>}
    <div className={styles['content__date']}>
      <ContentDate dateFormatted={dateFormatted} dateModifiedFormatted={dateModifiedFormatted} />
    </div>
    {(!!guestAuthor || !!guestCoAuthor) && (
      <div className={styles['content__guest-author']}>
        <GuestAuthor
          author={guestAuthor}
          coAuthor={guestCoAuthor}
          link={guestAuthorLink}
        />
      </div>
    )}
    <div className={styles['content__spacer']} />
    <CarbonAd smallOnly />
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
    {footer}
  </article>
);

export default Content;
