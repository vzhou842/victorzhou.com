'use strict';

const path = require('path');
const _ = require('lodash');
const createTagsPages = require('./pagination/create-tags-pages.js');
const createPostsPages = require('./pagination/create-posts-pages.js');

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // 404
  createPage({
    path: '/404/',
    component: path.resolve('./src/templates/not-found-template.js'),
  });

  // Subscriber Thank You
  createPage({
    path: '/subscriber-thank-you/',
    component: path.resolve('./src/templates/subscriber-thank-you-template.js'),
  });

  // Tags list
  createPage({
    path: '/tags/',
    component: path.resolve('./src/templates/tags-list-template.js'),
  });

  // Posts and pages from markdown
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              template
              usesKatex
              prev
              next
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const { edges } = result.data.allMarkdownRemark;

  _.each(edges, edge => {
    const prev = _.get(edge, 'node.frontmatter.prev');
    const next = _.get(edge, 'node.frontmatter.next');
    let template = _.get(edge, 'node.frontmatter.template');
    if (_.get(edge, 'node.frontmatter.usesKatex')) {
      template = 'math-post';
    }
    createPage({
      path: edge.node.fields.slug,
      component: path.resolve(`./src/templates/${template}-template.js`),
      context: { slug: edge.node.fields.slug, prev, next },
    });
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createPostsPages(graphql, actions);
};

module.exports = createPages;
