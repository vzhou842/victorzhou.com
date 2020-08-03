// @flow
import React from 'react';

import contentStyles from '../Content/Content.module.scss';
import Post from '../Post';
import SeriesPost from './SeriesPost';

type SeriesType = {|
  +htmlAst: Object,
  +fields: {
    +dateFormatted: string,
    +dateModifiedFormatted?: string,
  },
  +frontmatter: {|
    +description: string,
    +discussLinkTwitter?: string,
    +discussLinkHN?: string,
    +discussLinkReddit?: string,
    +isML: boolean,
    +isWeb: boolean,
    +img: string,
    +slug: string,
    +seriesSlugs: Array<string>,
    +title: string,
  |},
|};

type SeriesPostType = {
  +node: {
    +fields: {|
      +dateFormatted: string,
      +dateModifiedFormatted?: string,
    |},
    +frontmatter: {|
      +description: string,
      +img: string,
      +slug: string,
      +title: string,
    |},
  },
};

type Props = {|
  +htmlEnd: string,
  +series: SeriesType,
  +seriesPosts: {
    +edges: Array<SeriesPostType>,
  },
|};

const Series = ({ htmlEnd, series, seriesPosts }: Props) => {
  // seriesPosts aren't necessarily in order, so we sort by seriesSlugs
  const { seriesSlugs } = series.frontmatter;
  const nodes = seriesPosts.edges.map(e => e.node);
  nodes.sort(
    (a, b) => seriesSlugs.indexOf(a.frontmatter.slug) - seriesSlugs.indexOf(b.frontmatter.slug)
  );

  return (
    <Post
      post={series}
      contentFooter={
        <div>
          {nodes.map((node, i) => (
            <SeriesPost
              key={node.frontmatter.title}
              {...node.frontmatter}
              {...node.fields}
              n={i + 1}
            />
          ))}
          <div
            className={contentStyles['content__body']}
            dangerouslySetInnerHTML={{ __html: htmlEnd }}
          />
        </div>
      }
      hideDescription
    />
  );
};

export default Series;
