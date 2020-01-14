// @flow
import React from 'react';
import { graphql } from 'gatsby';
import TemplateWrapper from '../components/TemplateWrapper';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';

type Props = {|
  +data: Object,
|};

const ArchiveTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;
  const { edges } = data.allMarkdownRemark;

  return (
    <TemplateWrapper>
      <Layout title={`Blog Archive - ${siteTitle}`} description={`An archive of all my blog posts. ${siteSubtitle}`}>
        <Sidebar />
        <Page>
          <Feed edges={edges} shortened={true} />
        </Page>
      </Layout>
    </TemplateWrapper>
  );
};

export const query = graphql`
  {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {
          template: { eq: "post" },
          draft: { ne: true },
          guestAuthor: { in: [null, ""] }
        }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
            dateFormatted
          }
          frontmatter {
            title
            date
            category
            description
            isSeries
          }
        }
      }
    }
  }
`;

export default ArchiveTemplate;
