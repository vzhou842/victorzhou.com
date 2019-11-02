// @flow
import React from 'react';
import { graphql, Link } from 'gatsby';
import TemplateWrapper from '../components/TemplateWrapper';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';
import { tagPagePath } from '../utils/page-paths';

type Props = {|
  +data: Object,
  +pageContext: Object,
|};

const metaDescriptions = {
  'Machine Learning': 'Machine Learning is, put simply, getting computers to generalize from examples. And that\'s what I try to do: put things simply. My posts on Machine Learning (ML) consist primarily of beginner-focused introductions to common ML models or concepts, and I strive to make my guides as clear and beginner-friendly as possible.',
  Flow: 'Flow is a static type checker for Javascript developed by Facebook. It\'s similar in many ways to TypeScript.',
  'Neural Networks': 'Neural Networks are a class of Machine Learning models that were inspired by the human brain. They\'ve exploded in popularity recently due to their effectiveness at attacking problems in a variety of subfields, like Computer Vision and Natural Language Processing.',
  'Computer Vision': 'Computer Vision is a field that focuses on teaching computers to "see," or to do tasks that the human visual system can do. Famous applications of Computer Vision include facial recognition, self-driving vehicles, and optical character recognition (OCR).',
  Keras: 'Keras is a popular Python Deep Learning library. It focuses on usability and fast experimentation, but is also powerful enough to support a wide variety of use cases.',
  'Natural Language Processing': 'Natural Language Processing (NLP) is a field that focuses on analyzing, understanding, or even generating human languages (like English). Well-known applications of NLP include chatbots, translators like Google Translate, and personal assistants like Siri.',
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
          <Link to="/blog/intro-to-neural-networks/">An Introduction to Neural Networks</Link>
        </li>
        <li>
          <Link to="/blog/intro-to-cnns-part-1/">
            An Introduction to Convolutional Neural Networks
          </Link>
        </li>
        <li>
          <Link to="/blog/intro-to-rnns/">An Introduction to Recurrent Neural Networks</Link>
        </li>
        <li>
          <Link to="/blog/intro-to-random-forests/">Random Forests for Complete Beginners</Link>
        </li>
      </ul>
      <p>
        Similar tags include <Link to="/tag/neural-networks">Neural Networks</Link>,{' '}
        <Link to="/tag/computer-vision">Computer Vision</Link>, and{' '}
        <Link to="/tag/random-forests">Random Forests</Link>.
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
  'Neural Networks': (
    <div>
      <p>
        Neural Networks are a class of <a href="/tag/machine-learning/">Machine Learning</a> models
        that were inspired by the human brain. They've exploded in popularity recently due to their
        effectiveness at attacking problems in a variety of subfields, like{' '}
        <a href="/tag/computer-vision/">Computer Vision</a> and{' '}
        <a href="/tag/natural-language-processing">Natural Language Processing</a>.
      </p>
      <p>
        If you're new to Neural Networks, I recommend reading my{' '}
        <Link to="/series/neural-networks-from-scratch">
          <b>Neural Networks From Scratch</b>
        </Link> Series first.
      </p>
    </div>
  ),
  'Computer Vision': (
    <div>
      <p>
        Computer Vision is a field that focuses on teaching computers to "see," or to
        do tasks that the human visual system can do. Famous applications of Computer Vision
        include{' '}
        <a href="https://en.wikipedia.org/wiki/Facial_recognition_system" target="_blank">
          facial recognition
        </a>,{' '}
        <a href="https://en.wikipedia.org/wiki/Autonomous_car" target="_blank">
          self-driving vehicles
        </a>, and{' '}
        <a href="https://en.wikipedia.org/wiki/Optical_character_recognition" target="_blank">
          optical character recognition
        </a> (OCR).
      </p>
      <p>
        If you're interested in getting started in Computer Vision, I recommend reading my{' '}
        <b><a href="/blog/intro-to-cnns-part-1">
          Introduction to Convolutional Neural Networks
        </a></b> (CNNs) first.
      </p>
    </div>
  ),
  Keras: (
    <div>
      <p>
        <a href="https://keras.io" target="_blank">Keras</a> is a popular Python Deep Learning
        library. It focuses on usability and fast experimentation, but is also powerful enough to
        support a wide variety of use cases.
      </p>
      <p>
        If you're looking to get started with Keras, my{' '}
        <a href="/blog/keras-neural-network-tutorial/">Keras Neural Network tutorial</a> is a good
        place to begin.
      </p>
    </div>
  ),
  'Natural Language Processing': (
    <div>
      <p>
        Natural Language Processing (NLP) is a field that focuses on analyzing, understanding, or
        even generating human languages (like English). Well-known applications of NLP include{' '}
        <a href="https://en.wikipedia.org/wiki/Chatbot" target="_blank">chatbots</a>, translators
        like <a href="https://translate.google.com/" target="_blank">Google Translate</a>, and
        personal assistants like <a href="https://www.apple.com/siri/" target="_blank">Siri</a>.
      </p>
      <p>
        If you're interested in getting started with NLP, I recommend reading my{' '}
        <b><a href="/blog/intro-to-rnns">
          Introduction to Recurrent Neural Networks
        </a></b> (RNNs) first.
      </p>
    </div>
  ),
};

const TagTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = data.site.siteMetadata;

  const {
    tag,
    tagSlug,
    currentPage,
    hasPrevPage,
    hasNextPage,
    numPages,
  } = pageContext;

  const { edges } = data.allMarkdownRemark;
  const pageTitle =
    currentPage > 1 ?
      `${tag} Articles - Page ${currentPage} - ${siteTitle}` :
      `${tag} Articles - ${siteTitle}`;

  return (
    <TemplateWrapper>
      <Layout title={pageTitle} description={metaDescriptions[tag] || siteSubtitle}>
        <Sidebar />
        <Page
          title={`${tag}${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
          subtitle={<Link to="/tags/">← Back to All Tags</Link>}
          description={tagDescriptions[tag]}
        >
          <Feed edges={edges} />
          <Pagination
            currentPage={currentPage}
            pagePath={tagPagePath.bind(null, tagSlug)}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            numPages={numPages}
          />
        </Page>
      </Layout>
    </TemplateWrapper>
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
            isSeries
          }
        }
      }
    }
  }
`;

export default TagTemplate;
