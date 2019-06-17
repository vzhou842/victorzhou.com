// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import Post from '../components/Post';
import NavHeader from '../components/NavHeader';
import SubscribePopup from '../components/SubscribePopup';
import CarbonAd from '../components/CarbonAd';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const PostTemplate = ({ data, pageContext }: Props) => {
  const {
    author,
    title: siteTitle,
    subtitle: siteSubtitle,
    url: siteUrl,
  } = data.site.siteMetadata;
  const { edges } = data.allMarkdownRemark;
  const { slug, prev, next } = pageContext;

  const [slugNode, prevNode, nextNode] = [slug, prev, next].map(
    s => edges.filter(e => e.node.frontmatter.slug === s)[0].node,
  );

  const {
    asyncScript,
    canonical,
    category,
    date,
    dateModified,
    img: imgUrl,
    lists,
    title: postTitle,
    description: postDescription,
    twitterEmbed,
  } = slugNode.frontmatter;
  const { readingTime } = slugNode.fields;

  const metaDescription = postDescription !== null ? postDescription : siteSubtitle;

  return (
    <div>
      <NavHeader />
      <Layout title={`${postTitle} - ${siteTitle}`} description={metaDescription}>
        <Helmet>
          {canonical && <link rel="canonical" href={canonical} />}
          <meta property="og:type" content="article" />
          <meta property="og:image" content={imgUrl} />
          {twitterEmbed && (
            <script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8" />
          )}
          {asyncScript && (
            <script async src={asyncScript} />
          )}
          <script type="application/ld+json">
            {
`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "image": "${imgUrl}",
  "url": "${siteUrl + slug}",
  "headline": "${postTitle}",
  "description": "${postDescription}",
  "wordcount": "${readingTime.words}",
  "dateCreated": "${date}",
  "datePublished": "${date}",
  "dateModified": "${dateModified || date}",
  "inLanguage": "en-US",
  "mainEntityOfPage": "True",
  "articleBody": "${slugNode.excerpt}",
  "articleSection": "${category}",
  "author": {
    "@type": "Person",
    "name": "${author.name}",
    "url": "${siteUrl}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${author.name}",
    "url": "${siteUrl}",
    "logo": {
      "@type": "ImageObject",
      "url": "${siteUrl}${author.photoLarge}",
      "width": "1024",
      "height": "1024"
    }
  }
}`
            }
          </script>
        </Helmet>
        <Post post={slugNode} prevPost={prevNode} nextPost={nextNode} />
      </Layout>
      <SubscribePopup postSlug={slug} lists={lists} />
      <div
        style={{
          position: 'absolute',
          top: 'calc((100% - 217px) / 2)',
          right: 'calc(((100% - 700px) / 2 - 150px) / 2)',
        }}
      >
        <CarbonAd largeOnly />
      </div>
    </div>
  );
};

export const fragment = graphql`
  fragment PostFragment on Query {
    site {
      siteMetadata {
        author {
          name
          photoLarge
        }
        url
        subtitle
        title
      }
    }
    allMarkdownRemark(filter: { frontmatter: { slug: { in: [$slug, $prev, $next] } } }) {
      edges {
        node {
          id
          html
          excerpt(pruneLength: 5000)
          fields {
            tagSlugs
            readingTime {
              words
            }
          }
          frontmatter {
            asyncScript
            canonical
            category
            date
            dateModified
            description
            img
            lists
            slug
            tags
            title
            twitterEmbed
            discussLinkTwitter
            discussLinkHN
            discussLinkReddit
          }
        }
      }
    }
  }
`;

export const query = graphql`
  query PostBySlug($slug: String!, $prev: String!, $next: String!) {
    ...PostFragment
  }
`;

export default PostTemplate;
