import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

import { logEvent } from '../../utils/log';
import styles from './Share.module.scss';

interface Props {
  title: string;
  url: string;
  shareText?: string;
}

interface PureProps extends Props {
  twitter: string;
}

const PureShare = ({ title, url, shareText, twitter }: PureProps) => (
  <div className={styles['share']}>
    <h4 className={styles['share-title']}>{shareText || 'SHARE THIS POST'}</h4>
    <div className={styles['share-buttons']}>
      <FacebookShareButton
        beforeOnClick={() => logEvent('ShareButton', 'facebook-click')}
        className={styles['facebook']}
        resetButtonStyle={false}
        url={url}
      >
        Facebook
      </FacebookShareButton>
      <TwitterShareButton
        beforeOnClick={() => logEvent('ShareButton', 'twitter-click')}
        className={styles['twitter']}
        resetButtonStyle={false}
        url={url}
        title={title}
        via={twitter}
      >
        Twitter
      </TwitterShareButton>
      <LinkedinShareButton
        beforeOnClick={() => logEvent('ShareButton', 'linkedin-click')}
        className={styles['linkedin']}
        resetButtonStyle={false}
        url={url}
        title={title}
      >
        LinkedIn
      </LinkedinShareButton>
      <RedditShareButton
        beforeOnClick={() => logEvent('ShareButton', 'reddit-click')}
        className={styles['reddit']}
        resetButtonStyle={false}
        url={url}
        title={title}
      >
        Reddit
      </RedditShareButton>
    </div>
  </div>
);

export const Share = ({ url, ...props }: Props) => (
  <StaticQuery
    query={graphql`
      query ShareQuery {
        site {
          siteMetadata {
            url
            author {
              contacts {
                twitter
              }
            }
          }
        }
      }
    `}
    render={(data: any) => (
      <PureShare
        {...props}
        url={data.site.siteMetadata.url + url}
        twitter={data.site.siteMetadata.author.contacts.twitter}
      />
    )}
  />
);

export default Share;
