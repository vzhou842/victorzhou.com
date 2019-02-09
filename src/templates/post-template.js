import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Post from '../components/Post';
import NavHeader from '../components/NavHeader';

const PostTemplate = ({ data }) => {
  const {
    title: siteTitle,
    subtitle: siteSubtitle,
    url: siteUrl,
  } = data.site.siteMetadata;

  const {
    canonical,
    img: postImage,
    title: postTitle,
    description: postDescription,
  } = data.markdownRemark.frontmatter;

  const { slug: postSlug } = data.markdownRemark.fields;

  const metaDescription = postDescription !== null ? postDescription : siteSubtitle;

  return (
    <div>
      <Helmet>
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:image" content={siteUrl + postImage} />
        <meta property="og:url" content={siteUrl + postSlug} />
      </Helmet>
      <NavHeader />
      <Layout title={`${postTitle} - ${siteTitle}`} description={metaDescription}>
        <Post post={data.markdownRemark} />
      </Layout>
    </div>
  );
};

export const query = graphql`
  query PostBySlug($slug: String!) {
    site {
      siteMetadata {
        disqusShortname
        subtitle
        title
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        canonical
        date
        description
        img
        tags
        title
      }
    }
  }
`;

export default PostTemplate;
