'use strict';

const path = require('path');
const siteConfig = require('../../config.js');
const { postPagePath, topPostsPagePath } = require('../utils/page-paths');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const { data } = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            template: { eq: "post" }
            draft: { ne: true }
          }
        }
      ) {
        totalCount
        edges {
          node {
            frontmatter {
              date
              popularity
              slug
            }
          }
        }
      }
    }
  `);

  const { totalCount, edges } = data.allMarkdownRemark;
  const frontmatters = edges.map(e => e.node.frontmatter);

  const { postsPerPage } = siteConfig;
  const numPages = Math.ceil(totalCount / postsPerPage);

  // Sort
  function byNew({ date }) {
    return new Date(date);
  }

  function byTop({ popularity }) {
    return popularity;
  }

  const postSlugs = frontmatters.sort((a, b) => byTop(b) - byTop(a)).map(f => f.slug);
  const newPostSlugs = frontmatters.sort((a, b) => byNew(b) - byNew(a)).map(f => f.slug);

  function createPostPage(i, sortByNew) {
    const pathFunc = sortByNew ? postPagePath : topPostsPagePath;
    const slugs = sortByNew ? newPostSlugs : postSlugs;
    createPage({
      path: pathFunc(i + 1),
      component: path.resolve('./src/templates/index-template.tsx'),
      context: {
        currentPage: i + 1,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1,
        numPages,
        postSlugs: slugs.slice(i * postsPerPage, (i + 1) * postsPerPage),
        sortByNew,
      },
    });
  }

  for (let i = 0; i < numPages; i += 1) {
    createPostPage(i, false);
    createPostPage(i, true);
  }
};
