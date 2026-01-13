// NOTE: This file is duplicated in gatsby/utils/page-paths.js for gatsby-node.js.
// Keep both in sync. Duplication is required because gatsby-node.js runs in CommonJS.

export const postPagePath = (page: number): string => (page <= 1 ? '/' : `/page/${page}/`);
export const topPostsPagePath = (page: number): string =>
  page <= 1 ? '/top/' : `/top/page/${page}/`;

export const tagPagePath = (tagSlug: string, page: number): string =>
  page <= 1 ? tagSlug : `${tagSlug}page/${page}/`;
