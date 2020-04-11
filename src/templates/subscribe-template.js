// @flow
import { graphql, Link } from 'gatsby';
import React from 'react';

import Layout from '../components/Layout';
import Page from '../components/Page';
import Sidebar from '../components/Sidebar';
import SubscribeForm from '../components/SubscribeForm';
import TemplateWrapper from '../components/TemplateWrapper';

const SubscribeTemplate = ({ data, pageContext }: Object) => {
  const { title: siteTitle } = data.site.siteMetadata;
  const { updateSubscription } = pageContext;

  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const source = `SubscribePage:${params.get('src') || ''}`;

  const title = updateSubscription ? 'Update Your Subscription' : 'Subscribe to My Newsletter';

  return (
    <TemplateWrapper>
      <Layout title={`${title} - ${siteTitle}`}>
        <Sidebar hideSubscribeForm hideAd />
        <Page title={title}>
          {updateSubscription ? (
            <p>Update your subscription preferences to my newsletter below.</p>
          ) : (
            <p>
              Hey, I'm Victor. I write about <Link to="/tag/web-development/">web development</Link>
              , <Link to="/tag/machine-learning/">machine learning</Link>, and{' '}
              <Link to="/tags/">more</Link> on this blog. You can subscribe to my newsletter to{' '}
              <b>get new blog posts by email</b>.
            </p>
          )}
          <SubscribeForm
            signupSource={source}
            large
            showAllOptions
            noDescription
            ignoreUserHasSubscribed={true}
          />
          <p>
            Don't hesitate to <Link to="/contact/">Contact Me</Link> if you have any issues!
          </p>
        </Page>
      </Layout>
    </TemplateWrapper>
  );
};

export const query = graphql`
  query SubscribeQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default SubscribeTemplate;
