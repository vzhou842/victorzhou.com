// @flow
import { Link } from 'gatsby';
import React from 'react';

import styles from './ReadMore.module.scss';

type PostType = {
  +fields: {
    +dateFormatted: string,
    +dateModifiedFormatted?: string,
  },
  +frontmatter: {
    +description: string,
    +slug: string,
    +title: string,
  },
};

type LinkProps = {|
  +post: PostType,
|};

type Props = {|
  +prevPost: PostType,
  +nextPost: PostType,
|};

const ReadMoreLink = ({
  post: {
    fields: { dateFormatted, dateModifiedFormatted },
    frontmatter: { description, slug, title },
  },
}: LinkProps) => (
  <div>
    <Link to={slug}>
      <b>{title}</b>
    </Link>
    <p>
      <b>{dateModifiedFormatted || dateFormatted}</b>
    </p>
    <p>{description}</p>
  </div>
);

const ReadMore = ({ prevPost, nextPost }: Props) => (
  <div className={styles['readmore']}>
    <h4 className={styles['readmore-title']}>YOU MIGHT ALSO LIKE</h4>
    <div className={styles['readmore-links']}>
      <ReadMoreLink post={prevPost} />
      <ReadMoreLink post={nextPost} />
    </div>
  </div>
);

export default ReadMore;
