import { graphql, Link } from 'gatsby';
import React from 'react';

import { logEvent } from '../../../utils/log';
import styles from './ReadMore.module.scss';

interface PostType {
  fields: {
    dateFormatted: string;
    dateModifiedFormatted?: string | null;
  };
  frontmatter: {
    description: string;
    img: string;
    slug: string;
    title: string;
  };
}

interface LinkProps {
  post: PostType;
}

interface Props {
  prevPost: PostType;
  nextPost: PostType;
}

const ReadMoreLink = ({
  post: {
    fields: { dateFormatted, dateModifiedFormatted },
    frontmatter: { description, img, slug, title },
  },
}: LinkProps) => (
  <div>
    <Link
      to={slug}
      onClick={() => {
        logEvent('ReadMore', 'click');
      }}
    >
      <img className={styles['readmore-thumbnail']} loading="lazy" src={img} alt={title} />
    </Link>
    <Link
      to={slug}
      onClick={() => {
        logEvent('ReadMore', 'click');
      }}
    >
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

export const fragment = graphql`
  fragment ReadMoreFragment on MarkdownRemark {
    fields {
      dateFormatted
      dateModifiedFormatted
    }
    frontmatter {
      description
      img
      slug
      title
    }
  }
`;

export default ReadMore;
