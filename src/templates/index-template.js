// @flow
import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

import Feed from '../components/Feed';
import Layout from '../components/Layout';
import MovableSidebarContent from '../components/MovableSidebarContent';
import Page from '../components/Page';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import SortBySelector from '../components/SortBySelector';
import TemplateWrapper from '../components/TemplateWrapper';
import { postPagePath, hotPostsPagePath } from '../utils/page-paths';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const IndexTemplate = ({ data, pageContext }: Props) => {
  const { author, title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const { currentPage, hasNextPage, hasPrevPage, numPages, postSlugs, sortByNew } = pageContext;

  let { edges } = data.allMarkdownRemark;
  edges = postSlugs.map(slug => edges.filter(e => e.node.frontmatter.slug === slug)[0]);

  const pageTitle = currentPage > 1 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  return (
    <TemplateWrapper>
      <Layout title={pageTitle} description={siteSubtitle}>
        <Helmet>
          <script type="application/ld+json">
            {`{
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
}`}
          </script>
        </Helmet>
        <Sidebar />
        <Page
          title={currentPage > 1 ? `Page ${currentPage}` : ''}
          meta={<SortBySelector sortByNew={sortByNew} />}
        >
          <Feed edges={edges} />
          <Pagination
            currentPage={currentPage}
            pagePath={sortByNew ? postPagePath : hotPostsPagePath}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            numPages={numPages}
          />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </TemplateWrapper>
  );
};

export const query = graphql`
  query IndexTemplate($postSlugs: [String]!) {
    site {
      siteMetadata {
        author {
          name
        }
        title
        subtitle
      }
    }
    allMarkdownRemark(filter: { frontmatter: { slug: { in: $postSlugs } } }) {
      edges {
        node {
          frontmatter {
            slug
          }
        }
        ...FeedFragment
      }
    }
  }
`;

export default IndexTemplate;
