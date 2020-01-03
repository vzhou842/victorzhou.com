// @flow
import React from 'react';
import styles from './GuestAuthor.module.scss';

type Props = {|
  +author: ?string,
  +coAuthor: ?string,
  +link?: ?string,
|};

export default function GuestAuthor({ author, coAuthor, link }: Props) {
  console.log(author, coAuthor);
  if (!author && !coAuthor) {
    return null;
  }
  return (
    <p className={styles['root']}>
      {
        !coAuthor ? 'Guest Post by ' : 'Co-Authored by '
      }
      {link ? (
        <a target="_blank" href={link}>
          {coAuthor || author}
        </a>
      ) : (
        author
      )}
    </p>
  );
}
