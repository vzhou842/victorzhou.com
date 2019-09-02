'use strict';

const path = require('path');
const siteConfig = require('../../config.js');
const { postPagePath } = require('../../src/utils/page-paths');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
      ) { totalCount }
    }
  `);

  const { postsPerPage } = siteConfig;
  const numPages = Math.ceil(result.data.allMarkdownRemark.totalCount / postsPerPage);

  for (let i = 0; i < numPages; i += 1) {
    createPage({
      path: postPagePath(i + 1),
      component: path.resolve('./src/templates/index-template.js'),
      context: {
        currentPage: i + 1,
        postsLimit: postsPerPage,
        postsOffset: i * postsPerPage,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1,
        numPages,
      }
    });
  }
};
