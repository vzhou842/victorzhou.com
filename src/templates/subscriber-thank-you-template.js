import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import Share from '../components/Share';

const SubscriberThankYouTemplate = ({ data }) => {
  const {
    title,
    url,
  } = data.site.siteMetadata;

  return (
    <Layout title={`Thanks for Subscribing! - ${title}`}>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Sidebar />
      <Page title="Thanks for Subscribing!">
        <h3>Your subscription to my mailing list has been confirmed.</h3>
        <p>I'll let you know about new posts or big announcements I make.</p>
        <h3>If you've enjoyed my blog, let your friends know!</h3>
        <Share title={title} url={url} shareText="SHARE" />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query SubscriberThankYouQuery {
    site {
      siteMetadata {
        title,
        url,
      }
    }
  }
`;

export default SubscriberThankYouTemplate;
