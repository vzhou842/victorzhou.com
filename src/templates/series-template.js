// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import NavHeader from '../components/NavHeader';
import Series from '../components/Series';

export type SeriesType = {|
  +html: string,
  +frontmatter: {|
    +date: Date,
    +description: string,
    +discussLinkTwitter?: string,
    +discussLinkHN?: string,
    +discussLinkReddit?: string,
    +isML: boolean,
    +isWeb: boolean,
    +img: string,
    +slug: string,
    +seriesSlugs: Array<string>,
    +title: string,
  |},
|};

export type SeriesPostType = {
  +node: {
    +frontmatter: {
      +date: Date,
      +dateModified?: Date,
      +description: string,
      +img: string,
      +slug: string,
      +title: string,
    },
  },
};

type Props = {|
  +data: {|
    +site: Object,
    +series: SeriesType,
    +seriesEnd: Object,
    +seriesPosts: {|
      +edges: Array<SeriesPostType>,
    |},
  |},
|};

const SeriesTemplate = ({ data }: Props) => {
  const { title: siteTitle } = data.site.siteMetadata;

  const {
    description,
    img,
    title: pageTitle,
  } = data.series.frontmatter;

  return (
    <div>
      <NavHeader />
      <Layout title={`${pageTitle} - ${siteTitle}`} description={description}>
        <Helmet>
          <meta property="og:type" content="article" />
          <meta property="og:image" content={img} />
        </Helmet>
        <Series
          htmlEnd={data.seriesEnd.html}
          series={data.series}
          seriesPosts={data.seriesPosts}
        />
      </Layout>
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
        date
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
