// @flow
import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import styles from './Share.module.scss';

type Props = {
  +title: string,
  +url: string,
  +shareText: string,
};

type PureProps = {
  +twitter: string,
} & Props;

const PureShare = ({ title, url, shareText, twitter }: PureProps) => (
  <div className={styles['share']}>
    <h4 className={styles['share-title']}>{shareText || 'SHARE THIS POST'}</h4>
    <div className={styles['share-buttons']}>
      <FacebookShareButton url={url} className="button is-outlined is-rounded facebook">
        <button className={styles['facebook']}>Facebook</button>
      </FacebookShareButton>
      <TwitterShareButton url={url} className="button is-outlined is-rounded twitter" title={title} via={twitter}>
        <button className={styles['twitter']}>Twitter</button>
      </TwitterShareButton>
      <LinkedinShareButton url={url} className="button is-outlined is-rounded linkedin" title={title}>
        <button className={styles['linkedin']}>LinkedIn</button>
      </LinkedinShareButton>
      <RedditShareButton url={url} className="button is-outlined is-rounded reddit" title={title}>
        <button className={styles['reddit']}>Reddit</button>
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
    render={data => (
      <PureShare
        {...props}
        url={data.site.siteMetadata.url + url}
        twitter={data.site.siteMetadata.author.contacts.twitter}
      />
    )}
  />
);

export default Share;
