'use strict';

const path = require('path');
const _ = require('lodash');
const createTagsPages = require('./pagination/create-tags-pages.js');
const createPostsPages = require('./pagination/create-posts-pages.js');

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Subscriber Thank You
  createPage({
    path: '/subscriber-thank-you/',
    component: path.resolve('./src/templates/subscriber-thank-you-template.js'),
  });

  // Subscribe
  createPage({
    path: '/subscribe/',
    component: path.resolve('./src/templates/subscribe-template.js'),
  });

  // Update Subscription
  createPage({
    path: '/update-subscription/',
    component: path.resolve('./src/templates/subscribe-template.js'),
    context: { updateSubscription: true },
  });

  // Tags list
  createPage({
    path: '/tags/',
    component: path.resolve('./src/templates/tags-list-template.js'),
  });

  // Archive
  createPage({
    path: '/archive/',
    component: path.resolve('./src/templates/archive-template.js'),
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
              seriesSlugs
              frontSlug
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
    // Skip -end files, which are appended on to their corresponding primary files.
    const frontSlug = _.get(edge, 'node.frontmatter.frontSlug');
    if (frontSlug) {
      return;
    }

    const { slug } = edge.node.fields;
    const prev = _.get(edge, 'node.frontmatter.prev');
    const next = _.get(edge, 'node.frontmatter.next');
    const seriesSlugs = _.get(edge, 'node.frontmatter.seriesSlugs') || [];
    let template = _.get(edge, 'node.frontmatter.template');
    if (_.get(edge, 'node.frontmatter.usesKatex')) {
      template = 'math-post';
    }
    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${template}-template.js`),
      context: { slug, prev, next, seriesSlugs },
    });
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createPostsPages(graphql, actions);
};

module.exports = createPages;
