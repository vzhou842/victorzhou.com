// @flow
import React from 'react';
import SeriesPost from './SeriesPost';
import Author from '../Author';
import Discuss from '../Discuss';
import Share from '../Share';
import SubscribeForm from '../SubscribeForm';

type Props = {|
  +frontmatter: Object,
  +html: string,
  +htmlEnd: string,
  +seriesPosts: {
    +edges: Array<Object>,
  },
|};

const Series = ({ frontmatter, html, htmlEnd, seriesPosts }: Props) => {
  const {
    discussLinkTwitter,
    discussLinkHN,
    discussLinkReddit,
    isML,
    isWeb,
    seriesSlugs,
    slug,
    title,
  } = frontmatter;

  // seriesPosts aren't necessarily in order, so we sort by seriesSlugs
  const frontmatters = seriesPosts.edges.map(e => e.node.frontmatter);
  frontmatters.sort((a, b) => seriesSlugs.indexOf(a.slug) - seriesSlugs.indexOf(b.slug));

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {frontmatters.map((post, i) => (
        <SeriesPost key={post.title} {...post} n={i + 1} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: htmlEnd }} />
      <SubscribeForm signupSource={`Series:${slug}`} isML={isML} isWeb={isWeb} large />
      <Author showBio showTwitter />
      <Share url={slug} title={title} shareText="SHARE THIS SERIES" />
      <Discuss twitter={discussLinkTwitter} hn={discussLinkHN} reddit={discussLinkReddit} />
    </div>
  );
};

export default Series;
