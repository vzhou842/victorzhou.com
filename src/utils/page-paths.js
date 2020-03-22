const postPagePath = page => (page <= 1 ? '/' : `/page/${page}`);
const hotPostsPagePath = page => (page <= 1 ? '/hot' : `/hot/page/${page}`);

const tagPagePath = (tagSlug, page) => (page <= 1 ? tagSlug : `${tagSlug}page/${page}`);

module.exports = {
  postPagePath,
  hotPostsPagePath,
  tagPagePath,
};
