// @flow
import classnames from 'classnames/bind';
import { graphql } from 'gatsby';
import GithubSlugger from 'github-slugger';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import styles from './TableOfContents.module.scss';

const cx = classnames.bind(styles);

const slugger = new GithubSlugger();

const TOP_BUFFER = 80;

type Props = $ReadOnly<{|
  headings: { depth: number, value: string }[],
|}>;

const TableOfContents = ({ headings }: Props) => {
  slugger.reset();
  const slugs = headings.map(h => slugger.slug(h.value));

  const href = typeof window !== 'undefined' ? window.location.href : '';

  // The currently-active heading.
  // Initialized based on the anchor in the URL, if any.
  const [currentHeading, setCurrentHeading] = useState(
    slugs.findIndex(h => href.includes(`#${h}`))
  );

  // The parent element of all the heading elements.
  const parent = document.getElementById(slugs[0])?.parentElement;

  // The height of the parent element above.
  // Note that on initial render, parent will be undefined, so this value will be 0.
  // That's okay - this state value won't necessarily be accurate (but we don't actually
  // use its value), and we may trigger one unnecessary rerender, but that's a small
  // price to pay for the relative simplicity of this approach.
  const [contentHeight, setContentHeight] = useState(parent?.clientHeight ?? 0);

  // Update contentHeight so we rerender and re-calculate headerOffsets when necessary.
  // We need to do this because the page's height can change after initial render from things
  // like dynamically loading embeds, for example.
  useLayoutEffect(() => {
    if (!parent || typeof ResizeObserver !== 'function') {
      return;
    }
    const observer = new ResizeObserver(entries => {
      setContentHeight(entries[0].target.clientHeight);
    });
    observer.observe(parent);
    return () => {
      observer.disconnect();
    };
  }, [parent]);

  // Attach a scroll listener on mount to change headings.
  useEffect(() => {
    const headerOffsets = slugs.map(slug => document.getElementById(slug)?.offsetTop ?? 0);

    const onScroll = () => {
      const currPos = window.pageYOffset;
      for (let i = 0; i <= headerOffsets.length; i++) {
        if (i === headerOffsets.length || currPos < headerOffsets[i] - TOP_BUFFER) {
          setCurrentHeading(i - 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
    // We don't actually use contentHeight directly in this hook, but it affects headerOffsets and
    // will essentially always cause a change in a headerOffset when it changes. This is just easier
    // than dealing with deep equality checks for the headerOffsets array.
  }, [contentHeight]);

  return (
    <nav className={styles['toc']}>
      <h2 className={styles['toc__title']}>Table of Contents</h2>
      {headings.map(({ depth, value }, i) => {
        const slug = slugs[i];
        return (
          <a
            className={cx(`toc-h${depth}`, {
              toc__active: i === currentHeading,
            })}
            href={`#${slug}`}
            key={slug}
          >
            {value}
          </a>
        );
      })}
    </nav>
  );
};

export const query = graphql`
  fragment TableOfContentsFragment on MarkdownRemark {
    headings {
      depth
      value
    }
  }
`;

export default TableOfContents;
