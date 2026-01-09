import loadable from '@loadable/component';
import { graphql } from 'gatsby';
import React, { ReactNode } from 'react';
import rehypeReact from 'rehype-react';

import ContentDate from '../ContentDate';
import GuestAuthor from '../GuestAuthor';
import styles from './Content.module.scss';

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { 'csrf-post-button': loadable(() => import('../CSRFPostButton')) },
  Fragment: React.Fragment,
}).Compiler;

interface Props {
  htmlAst: any;
  title: string;
  subtitle?: string | null;
  dateFormatted: string;
  dateModifiedFormatted?: string | null;
  footer?: ReactNode | null;
  guestAuthor?: string | null;
  guestCoAuthor?: string | null;
  guestAuthorLink?: string | null;
}

const Content = ({
  htmlAst,
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
    <div className={styles['content__body']}>{renderAst(htmlAst)}</div>
    {footer}
  </article>
);

export const fragment = graphql`
  fragment ContentFragment on MarkdownRemark {
    htmlAst
    fields {
      ...ContentDateFragment
    }
    frontmatter {
      ...GuestAuthorFragment
    }
  }
`;

export default Content;
