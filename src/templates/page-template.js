// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import MovableSidebarContent from '../components/MovableSidebarContent';

type Props = {|
  +data: Object,
|};

const PageTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const {
    title: pageTitle,
    description: pageDescription,
    hideSubscribe,
    hideAd,
    noIndex,
  } = data.markdownRemark.frontmatter;

  const { html: pageBody } = data.markdownRemark;

  const metaDescription = pageDescription !== null ? pageDescription : siteSubtitle;

  return (
    <>
      <Layout title={`${pageTitle} - ${siteTitle}`} description={metaDescription}>
        {noIndex && (
          <Helmet>
            <meta name="robots" content="noindex" />
          </Helmet>
        )}
        <Sidebar hideSubscribeForm={hideSubscribe} hideAd={hideAd} />
        <Page title={pageTitle}>
          <div dangerouslySetInnerHTML={{ __html: pageBody }} />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </>
  );
};

export const query = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date
        description
        hideSubscribe
        hideAd
        noIndex
      }
    }
  }
`;

export default PageTemplate;
