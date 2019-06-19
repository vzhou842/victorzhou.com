// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const metaDescriptions = {
  'Machine Learning': 'Machine Learning is, put simply, getting computers to generalize from examples. And that\'s what I try to do: put things simply. My posts on Machine Learning (ML) consist primarily of beginner-focused introductions to common ML models or concepts, and I strive to make my guides as clear and beginner-friendly as possible.',
  'Flow': 'Flow is a static type checker for Javascript developed by Facebook. It\'s similar in many ways to TypeScript.'
};

const tagDescriptions = {
  'Machine Learning': (
    <div>
      <p>
        Machine Learning is, put simply, getting computers to generalize from examples. And that's
        what I try to do: <b>put [seemingly complicated] things simply</b>. My posts on Machine
        Learning (ML) consist primarily of beginner-focused introductions to common ML models or
        concepts. I felt like too many ML tutorials weren't accessible enough, so I strove to make
        my guides <b>as clear and beginner-friendly as possible</b>.
      </p>
      <p style={{ marginBottom: 0 }}>
        Unsure where to start? Here are some of my best / most popular posts:
      </p>
      <ul>
        <li>
          <a href="/blog/intro-to-neural-networks/">
            Machine Learning for Beginners: An Introduction to Neural Networks
          </a>
        </li>
        <li>
          <a href="/blog/intro-to-cnns-part-1/">An Introduction to Convolutional Neural Networks</a>
        </li>
        <li>
          <a href="/blog/intro-to-random-forests/">Random Forests for Complete Beginners</a>
        </li>
      </ul>
      <p>
        Similar tags include <a href="/tag/neural-networks">Neural Networks</a>,{' '}
        <a href="/tag/computer-vision">Computer Vision</a>, and{' '}
        <a href="/tag/random-forests">Random Forests</a>.
      </p>
      <p>Happy Reading!</p>
    </div>
  ),
  Flow: (
    <div>
      <p>
        <a href="https://flow.org/" target="_blank">
          Flow
        </a>{' '}
        is a static type checker for Javascript developed by Facebook. It's similar in many ways to{' '}
        <a href="https://www.typescriptlang.org/" target="_blank">
          TypeScript
        </a>
        .
      </p>
    </div>
  ),
};

const TagTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const {
    tag,
    currentPage,
    prevPagePath,
    nextPagePath,
    hasPrevPage,
    hasNextPage,
    numPages,
  } = pageContext;

  const { edges } = data.allMarkdownRemark;
  const pageTitle =
    currentPage > 0 ?
      `${tag} Posts - Page ${currentPage} - ${siteTitle}` :
      `${tag} Posts - ${siteTitle}`;

  return (
    <Layout title={pageTitle} description={metaDescriptions[tag] || siteSubtitle}>
      <Sidebar />
      <Page
        title={tag}
        subtitle={<a href="/tags/">← Back to All Tags</a>}
        description={tagDescriptions[tag]}
      >
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
  );
};

export const query = graphql`
  query TagPage($tag: String, $postsLimit: Int!, $postsOffset: Int!) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
      limit: $postsLimit
      skip: $postsOffset
      filter: {
        frontmatter: { tags: { in: [$tag] }, template: { eq: "post" }, draft: { ne: true } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
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

export default TagTemplate;
