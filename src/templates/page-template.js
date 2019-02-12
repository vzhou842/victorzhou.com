import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import MovableSidebarContent from '../components/MovableSidebarContent';

const PageTemplate = ({ data }) => {
  const {
    title: siteTitle,
    subtitle: siteSubtitle
  } = data.site.siteMetadata;

  const {
    title: pageTitle,
    description: pageDescription
  } = data.markdownRemark.frontmatter;

  const { html: pageBody } = data.markdownRemark;

  const metaDescription = pageDescription !== null ? pageDescription : siteSubtitle;

  return (
    <div>
      <Layout title={`${pageTitle} - ${siteTitle}`} description={metaDescription}>
        <Sidebar />
        <Page title={pageTitle}>
          <div dangerouslySetInnerHTML={{ __html: pageBody }} />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </div>
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
      }
    }
  }
`;

export default PageTemplate;
