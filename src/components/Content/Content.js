// @flow
import { graphql } from 'gatsby';
import * as React from 'react';

import ContentDate from '../ContentDate';
import GuestAuthor from '../GuestAuthor';
import styles from './Content.module.scss';

type Props = {|
  +html: string,
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
  html,
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
        <GuestAuthor author={guestAuthor} coAuthor={guestCoAuthor} link={guestAuthorLink} />
      </div>
    )}
    <div className={styles['content__spacer']} />
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: html }} />
    {footer}
  </article>
);

export const fragment = graphql`
  fragment ContentFragment on MarkdownRemark {
    html
    fields {
      ...ContentDateFragment
    }
    frontmatter {
      ...GuestAuthorFragment
    }
  }
`;

export default Content;
