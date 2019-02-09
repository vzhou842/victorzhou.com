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
    author,
  } = data.site.siteMetadata;

  const {
    canonical,
    title: postTitle,
    description: postDescription,
  } = data.markdownRemark.frontmatter;

  const metaDescription = postDescription !== null ? postDescription : siteSubtitle;

  return (
    <div>
      {
        canonical && (
          <Helmet>
            <link rel="canonical" href={canonical} />
          </Helmet>
        )
      }
      <NavHeader author={author} />
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
        author {
          name
          photo
        }
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
        tags
        title
      }
    }
  }
`;

export default PostTemplate;
