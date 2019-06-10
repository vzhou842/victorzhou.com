// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';
import MovableSidebarContent from '../components/MovableSidebarContent';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const IndexTemplate = ({ data, pageContext }: Props) => {
  const { author, title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    prevPagePath,
    nextPagePath,
    numPages,
  } = pageContext;

  const { edges } = data.allMarkdownRemark;
  const pageTitle = currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  return (
    <div>
      <Layout title={pageTitle} description={siteSubtitle}>
        <Helmet>
          <script type="application/ld+json">
            {
`{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "${author.name}",
  "url": "https://victorzhou.com",
  "sameAs": [
    "https://www.facebook.com/zhouvictor",
    "https://twitter.com/victorczhou",
    "https://www.instagram.com/victorczhou/",
    "https://www.linkedin.com/in/vzhou842/"
  ]
}`
            }
          </script>
        </Helmet>
        <Sidebar />
        <Page>
          <Feed edges={edges} />
          <Pagination
            currentPage={currentPage}
            prevPagePath={prevPagePath}
            nextPagePath={nextPagePath}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            numPages={numPages}
          />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </div>
  );
};

export const query = graphql`
  query IndexTemplate($postsLimit: Int!, $postsOffset: Int!) {
    site {
      siteMetadata {
        author {
          name
        }
        title
        subtitle
      }
    }
    allMarkdownRemark(
        limit: $postsLimit,
        skip: $postsOffset,
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } },
        sort: { order: DESC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
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

export default IndexTemplate;
