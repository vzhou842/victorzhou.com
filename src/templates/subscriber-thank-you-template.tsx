import { graphql, Link } from 'gatsby';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';

import Layout from '../components/Layout';
import Page from '../components/Page';
import Share from '../components/Share';
import Sidebar from '../components/Sidebar';
import TemplateWrapper from '../components/TemplateWrapper';
import { setUserHasSubscribed } from '../utils/subscribe-status';

interface Props {
  data: any;
}

const SubscriberThankYouTemplate = ({ data }: Props) => {
  const { title, url } = data.site.siteMetadata;

  useEffect(setUserHasSubscribed, []);

  return (
    <TemplateWrapper>
      <Layout title={`Thanks for Subscribing! - ${title}`}>
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Sidebar hideSubscribeForm />
        <Page title="Thanks for Subscribing!">
          <h3>Your subscription to my mailing list has been confirmed.</h3>
          <p>You'll get new posts in your email inbox.</p>
          <h3>If you've enjoyed my blog, let your friends know!</h3>
          <Share title={title} url={url} shareText="SHARE" />
          <h3>Hungry for some more content right now?</h3>
          <p>
            Check out some of my <Link to="/top/">Top Posts</Link>.
          </p>
        </Page>
      </Layout>
    </TemplateWrapper>
  );
};

export const query = graphql`
  query SubscriberThankYouQuery {
    site {
      siteMetadata {
        title
        url
      }
    }
  }
`;

export default SubscriberThankYouTemplate;
