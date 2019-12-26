// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import TemplateWrapper from '../components/TemplateWrapper';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import MovableSidebarContent from '../components/MovableSidebarContent';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const GuestPostsTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const { edges } = data.allMarkdownRemark;
  const pageTitle = `Guest Posts - ${siteTitle}`;

  return (
    <TemplateWrapper>
      <Layout title={pageTitle} description={siteSubtitle}>
        <Sidebar />
        <Page>
          <Feed edges={edges} />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </TemplateWrapper>
  );
};

export const query = graphql`
  query GuestPostsTemplate {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true }, guestAuthor: { ne: null } } },
        sort: { order: DESC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            guestAuthor
            guestAuthorLink
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export default GuestPostsTemplate;
