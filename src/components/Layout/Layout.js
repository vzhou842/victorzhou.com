import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Helmet from 'react-helmet';
import styles from './Layout.module.scss';

export const PureLayout = ({ children, title, description, data }) => {
  const { author, url: siteUrl } = data.site.siteMetadata;

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={siteUrl + author.photoLarge} />
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
            }
          }
        }
      }
    `}
    render={data => <PureLayout {...props} data={data} />}
  />
);

export default Layout;
