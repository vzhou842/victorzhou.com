import { graphql } from 'gatsby';
import React from 'react';

import styles from './Discuss.module.scss';

interface Props {
  twitter?: string;
  hn?: string;
  reddit?: string;
}

function openLink(link: string) {
  window.open(link);
}

const Discuss = ({ twitter, hn, reddit }: Props) =>
  twitter || hn || reddit ? (
    <div className={styles['discuss']}>
      <h4 className={styles['discuss-title']}>DISCUSS ON</h4>
      <div className={styles['discuss-buttons']}>
        {twitter && (
          <button
            className={styles['discuss-button-twitter']}
            onClick={openLink.bind(null, twitter)}
          >
            Twitter
          </button>
        )}
        {hn && (
          <button className={styles['discuss-button-hn']} onClick={openLink.bind(null, hn)}>
            Hacker News
          </button>
        )}
        {reddit && (
          <button className={styles['discuss-button-reddit']} onClick={openLink.bind(null, reddit)}>
            Reddit
          </button>
        )}
      </div>
    </div>
  ) : null;

export const fragment = graphql`
  fragment DiscussFragment on MarkdownRemarkFrontmatter {
    discussLinkTwitter
    discussLinkHN
    discussLinkReddit
  }
`;

export default Discuss;
