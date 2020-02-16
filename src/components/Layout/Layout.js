import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

import styles from './Layout.module.scss';

export const PureLayout = ({ children, title, description, data }) => {
  const { author, url: siteUrl } = data.site.siteMetadata;
  const twitter = `@${author.contacts.twitter}`;

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={siteUrl + author.photoLarge} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={twitter} />
        <meta name="twitter:creator" content={twitter} />
      </Helmet>
      {children}
    </div>
  );
};

export const Layout = props => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            url
            author {
              photoLarge
              contacts {
                twitter
              }
            }
          }
        }
      }
    `}
    render={data => <PureLayout {...props} data={data} />}
  />
);

export default Layout;
