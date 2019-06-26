// @flow
import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import SubscribeForm from '../components/SubscribeForm';

const SubscribeTemplate = ({ data }: Object) => {
  const { title } = data.site.siteMetadata;

  const params =
    typeof window !== 'undefined' ?
      new URLSearchParams(window.location.search) :
      new URLSearchParams();
  const source = `SubscribePage:${params.get('src') || ''}`;

  return (
    <Layout title={`Subscribe to My Newsletter - ${title}`}>
      <Sidebar hideSubscribeForm hideAd />
      <Page title="Subscribe to My Newsletter">
        <p>
          Hey, I'm Victor. I write about <Link to="/tag/web-development/">web development</Link>,{' '}
          <Link to="/tag/machine-learning/">machine learning</Link>, and{' '}
          <Link to="/tags/">more</Link> on this blog. You can subscribe to my newsletter to{' '}
          <b>get new blog posts by email</b>.
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
        <SubscribeForm signupSource={source} large showAllOptions noDescription />
        <p>
          Don't hesitate to <Link to="/contact">Contact Me</Link> if you have any issues!
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
