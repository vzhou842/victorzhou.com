import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Post from '../components/Post';
import NavHeader from '../components/NavHeader';
import SubscribePopup from '../components/SubscribePopup';

const PostTemplate = ({ data }) => {
  const { title: siteTitle, subtitle: siteSubtitle, url: siteUrl } = data.site.siteMetadata;

  const {
    canonical,
    img: postImage,
    title: postTitle,
    description: postDescription,
    twitterEmbed,
  } = data.markdownRemark.frontmatter;

  const metaDescription = postDescription !== null ? postDescription : siteSubtitle;

  return (
    <div>
      <NavHeader />
      <Layout title={`${postTitle} - ${siteTitle}`} description={metaDescription}>
        <Helmet>
          {canonical && <link rel="canonical" href={canonical} />}
          <meta property="og:type" content="article" />
          <meta property="og:image" content={siteUrl + postImage} />
          {twitterEmbed && (
            <script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8" />
          )}
        </Helmet>
        <Post post={data.markdownRemark} />
      </Layout>
      <SubscribePopup />
    </div>
  );
};

export const fragment = graphql`
  fragment PostFragment on Query {
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
        tagSlugs
      }
      frontmatter {
        canonical
        disqusIdentifier
        date
        description
        img
        next
        prev
        slug
        tags
        title
        twitterEmbed
      }
    }
  }
`;

export const query = graphql`
  query PostBySlug($slug: String!) {
    ...PostFragment
  }
`;

export default PostTemplate;
