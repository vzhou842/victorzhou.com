const postPagePath = page => (page <= 1 ? '/' : `/page/${page}`);
const newPostsPagePath = page => (page <= 1 ? '/new' : `/new/page/${page}`);

const tagPagePath = (tagSlug, page) => (page <= 1 ? tagSlug : `${tagSlug}page/${page}`);

module.exports = {
  postPagePath,
  newPostsPagePath,
  tagPagePath,
};
