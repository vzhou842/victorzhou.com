'use strict';

const _ = require('lodash');
const path = require('path');
const siteConfig = require('../../config.js');
const { tagPagePath } = require('../../src/utils/page-paths');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;
  const { postsPerPage } = siteConfig;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  _.each(result.data.allMarkdownRemark.group, tag => {
    const numPages = Math.ceil(tag.totalCount / postsPerPage);
    const tagSlug = `/tag/${_.kebabCase(tag.fieldValue)}/`;

    for (let i = 0; i < numPages; i += 1) {
      createPage({
        path: tagPagePath(tagSlug, i + 1),
        component: path.resolve('./src/templates/tag-template.js'),
        context: {
          tag: tag.fieldValue,
          tagSlug,
          currentPage: i + 1,
          postsLimit: postsPerPage,
          postsOffset: i * postsPerPage,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numPages - 1,
          numPages,
        },
      });
    }
  });
};
