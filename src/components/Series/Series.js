// @flow
import React from 'react';
import SeriesPost from './SeriesPost';
import Post from '../Post';

import contentStyles from '../Content/Content.module.scss';

import type { SeriesType, SeriesPostType } from '../../templates/series-template';

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
  const frontmatters = seriesPosts.edges.map(e => e.node.frontmatter);
  frontmatters.sort((a, b) => seriesSlugs.indexOf(a.slug) - seriesSlugs.indexOf(b.slug));

  return (
    <Post
      post={series}
      contentFooter={
        <div>
          {frontmatters.map((post, i) => (
            <SeriesPost key={post.title} {...post} n={i + 1} />
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
