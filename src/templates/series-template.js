// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import MovableSidebarContent from '../components/MovableSidebarContent';
import Series from '../components/Series';

type Props = {|
  +data: Object,
|};

const SeriesTemplate = ({ data }: Props) => {
  const { title: siteTitle } = data.site.siteMetadata;

  const { html, frontmatter } = data.series;

  const {
    description,
    img,
    title: pageTitle,
  } = frontmatter;

  const { html: htmlEnd } = data.seriesEnd;

  return (
    <div>
      <Layout title={`${pageTitle} - ${siteTitle}`} description={description}>
        <Sidebar />
        <Helmet>
          <meta property="og:type" content="article" />
          <meta property="og:image" content={img} />
        </Helmet>
        <Page title={pageTitle}>
          <Series
            html={html}
            htmlEnd={htmlEnd}
            seriesPosts={data.seriesPosts}
            frontmatter={frontmatter}
          />
        </Page>
      </Layout>
      <MovableSidebarContent mobile />
    </div>
  );
};

export const query = graphql`
  query SeriesBySlug($slug: String!, $seriesSlugs: [String]!) {
    site {
      siteMetadata {
        title
      }
    }
    series: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        description
        discussLinkTwitter
        discussLinkHN
        discussLinkReddit
        isML
        isWeb
        img
        slug
        seriesSlugs
        title
      }
    }
    seriesEnd: markdownRemark(fields: { frontSlug: { eq: $slug } }) {
      html
    }
    seriesPosts: allMarkdownRemark(filter: { frontmatter: { slug: { in: $seriesSlugs } } }) {
      edges {
        node {
          frontmatter {
            date
            dateModified
            description
            img
            slug
            title
          }
        }
      }
    }
  }
`;

export default SeriesTemplate;
