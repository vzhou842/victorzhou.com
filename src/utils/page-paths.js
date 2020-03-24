const postPagePath = page => (page <= 1 ? '/' : `/page/${page}/`);
const topPostsPagePath = page => (page <= 1 ? '/top/' : `/top/page/${page}/`);

const tagPagePath = (tagSlug, page) => (page <= 1 ? tagSlug : `${tagSlug}page/${page}/`);

module.exports = {
  postPagePath,
  topPostsPagePath,
  tagPagePath,
};
