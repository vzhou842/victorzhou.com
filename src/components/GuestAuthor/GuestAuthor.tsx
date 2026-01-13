import { graphql } from 'gatsby';
import React from 'react';

import styles from './GuestAuthor.module.scss';

interface Props {
  author: string | null | undefined;
  coAuthor: string | null | undefined;
  link?: string | null | undefined;
}

export default function GuestAuthor({ author, coAuthor, link }: Props) {
  if (!author && !coAuthor) {
    return null;
  }
  return (
    <p className={styles['root']}>
      {author != null && coAuthor == null
        ? author.trim() !== ''
          ? 'Guest Post by '
          : 'Guest Post'
        : 'Co-Authored by '}
      {link ? (
        <a target="_blank" href={link} rel="noopener noreferrer">
          {coAuthor || author}
        </a>
      ) : (
        author
      )}
    </p>
  );
}

export const fragment = graphql`
  fragment GuestAuthorFragment on MarkdownRemarkFrontmatter {
    guestAuthor
    guestCoAuthor
    guestAuthorLink
  }
`;
