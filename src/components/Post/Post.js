import React from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';

import SubscribeForm from '../SubscribeForm';

const Post = ({ post }) => {
  const {
    tags,
    title,
    date,
    description,
  } = post.frontmatter;

  const { html } = post;
  const { tagSlugs } = post.fields;

  return (
    <div className={styles['post']}>
      <Link className={styles['post__home-button']} to="/">All Articles</Link>

      <div className={styles['post__content']}>
        <Content body={html} title={title} subtitle={description} />
      </div>

      <div className={styles['post__subscribeForm']}>
        <SubscribeForm large />
      </div>

      <div className={styles['post__footer']}>
        <Meta date={date} />
        <Tags tags={tags} tagSlugs={tagSlugs} />
        <Author />
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={post.fields.slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
