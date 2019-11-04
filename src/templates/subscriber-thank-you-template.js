import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import TemplateWrapper from '../components/TemplateWrapper';
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
    <TemplateWrapper>
      <Layout title={`Thanks for Subscribing! - ${title}`}>
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Sidebar hideSubscribeForm hideAd />
        <Page title="Thanks for Subscribing!">
          <h3>Your subscription to my mailing list has been confirmed.</h3>
          <p>You'll get new posts in your email inbox.</p>
          <h3>If you've enjoyed my blog, let your friends know!</h3>
          <Share title={title} url={url} shareText="SHARE" />
        </Page>
      </Layout>
    </TemplateWrapper>
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
