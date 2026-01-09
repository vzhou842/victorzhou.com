'use strict';

// NOTE: This file is duplicated in src/utils/page-paths.ts for TypeScript templates.
// Keep both in sync. Duplication is required because gatsby-node.js runs in CommonJS.

const postPagePath = (page) => (page <= 1 ? '/' : `/page/${page}/`);
const topPostsPagePath = (page) => (page <= 1 ? '/top/' : `/top/page/${page}/`);
const tagPagePath = (tagSlug, page) => (page <= 1 ? tagSlug : `${tagSlug}page/${page}/`);

module.exports = { postPagePath, topPostsPagePath, tagPagePath };
