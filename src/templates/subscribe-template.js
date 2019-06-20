// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import SubscribeForm from '../components/SubscribeForm';

const SubscribeTemplate = ({ data }: Object) => {
  const { title } = data.site.siteMetadata;

  return (
    <Layout title={`Subscribe to My Newsletter - ${title}`}>
      <Sidebar hideSubscribeForm hideAd />
      <Page title="Subscribe to My Newsletter">
        <p>
          Hey, I'm Victor. I write about <a href="/tag/web-development/">web development</a>,{' '}
          <a href="/tag/machine-learning/">machine learning</a>, and <a href="/tags/">more</a> on
          this blog. You can subscribe to my newsletter to <b>get new blog posts by email</b>.
        </p>
        <ul>
          <li>
            If you <b>haven't</b> subscribed before, you can do so right here!
          </li>
          <li>
            If you <b>have</b> subscribed before, you can <b>update your preferences</b> below.
            After pressing SUBMIT, you'll be sent to a page that says "You're already subscribed."
            If you see that, it worked - your preferences were updated!
          </li>
        </ul>
        <SubscribeForm signupSource="SubscribePage" large showAllOptions noDescription />
        <p>
          Don't hesitate to <a href="/contact">Contact Me</a> if you have any issues!
        </p>
      </Page>
    </Layout>
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
