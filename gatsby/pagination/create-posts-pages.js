'use strict';

const path = require('path');
const siteConfig = require('../../config.js');
const { postPagePath, hotPostsPagePath } = require('../../src/utils/page-paths');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const { data } = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            template: { eq: "post" }
            draft: { ne: true }
            guestAuthor: { in: [null, ""] }
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

  function byHot({ popularity, date }) {
    const p = Number.isInteger(popularity) ? popularity : 1;
    const daysOld = Math.max(1, Math.round((Date.now() - new Date(date)) / (1000 * 3600 * 24)));
    return p * (1 + 500 / daysOld);
  }

  const postSlugs = frontmatters.sort((a, b) => byHot(b) - byHot(a)).map(f => f.slug);
  const newPostSlugs = frontmatters.sort((a, b) => byNew(b) - byNew(a)).map(f => f.slug);

  function createPostPage(i, sortByNew) {
    const pathFunc = sortByNew ? postPagePath : hotPostsPagePath;
    const slugs = sortByNew ? newPostSlugs : postSlugs;
    createPage({
      path: pathFunc(i + 1),
      component: path.resolve('./src/templates/index-template.js'),
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
