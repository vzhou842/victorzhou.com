// @flow
import React from 'react';
import styles from './GuestAuthor.module.scss';

type Props = {|
  +author: string,
  +link?: ?string,
|};

export default function GuestAuthor({ author, link }: Props) {
  return (
    <p className={styles['root']}>
      Guest Post by{' '}
      {link ? (
        <a target="_blank" href={link}>
          {author}
        </a>
      ) : (
        author
      )}
    </p>
  );
}
