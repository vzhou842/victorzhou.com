// @flow
import classnames from 'classnames/bind';
import { graphql, StaticQuery } from 'gatsby';
import React, { useEffect, useState } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import { logEvent } from '../../utils/log';
import styles from './ShareIcons.module.scss';

const cx = classnames.bind(styles);

type Props = {
  +title: string,
  +url: string,
};

type PureProps = {
  +twitter: string,
} & Props;

function PureShareIcons({ title, url, twitter }: PureProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      return;
    }

    const threshold = Math.min(
      Math.max((document.body ? document.body.offsetHeight : 0) / 8, 500),
      1250
    );

    const scrollListener = () => {
      if (window.scrollY + window.innerHeight / 2 >= threshold) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [visible, setVisible]);

  return (
    <div className={cx({ share: true, hidden: !visible })}>
      <EmailShareButton
        beforeOnClick={() => logEvent('ShareIcon', 'email-click')}
        subject={title}
        url={url}
      >
        <EmailIcon size={32} />
      </EmailShareButton>
      <FacebookShareButton beforeOnClick={() => logEvent('ShareIcon', 'facebook-click')} url={url}>
        <FacebookIcon size={32} />
      </FacebookShareButton>
      <TwitterShareButton
        beforeOnClick={() => logEvent('ShareIcon', 'twitter-click')}
        url={url}
        title={title}
        via={twitter}
      >
        <TwitterIcon size={32} />
      </TwitterShareButton>
      <LinkedinShareButton
        beforeOnClick={() => logEvent('ShareIcon', 'linkedin-click')}
        url={url}
        title={title}
      >
        <LinkedinIcon size={32} />
      </LinkedinShareButton>
      <RedditShareButton
        beforeOnClick={() => logEvent('ShareIcon', 'reddit-click')}
        url={url}
        title={title}
      >
        <RedditIcon size={32} bgStyle={{ fill: 'ff4500' }} />
      </RedditShareButton>
      <WhatsappShareButton
        beforeOnClick={() => logEvent('ShareIcon', 'whatsapp-click')}
        url={url}
        title={title}
      >
        <WhatsappIcon size={32} />
      </WhatsappShareButton>
    </div>
  );
}

export const ShareIcons = ({ url, ...props }: Props) => (
  <StaticQuery
    query={graphql`
      query ShareIconsQuery {
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
      <PureShareIcons
        {...props}
        url={data.site.siteMetadata.url + url}
        twitter={data.site.siteMetadata.author.contacts.twitter}
      />
    )}
  />
);

export default ShareIcons;
