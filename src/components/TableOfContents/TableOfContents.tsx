import classnames from 'classnames/bind';
import { graphql } from 'gatsby';
import GithubSlugger from 'github-slugger';
import React, { useLayoutEffect, useState } from 'react';

import styles from './TableOfContents.module.scss';

const cx = classnames.bind(styles);

const slugger = new GithubSlugger();

const TOP_BUFFER = 80;

interface Props {
  headings: { depth: number; value: string }[];
}

const TableOfContents = ({ headings }: Props) => {
  const textHeadings = headings.map(h => {
    if (typeof DOMParser === 'undefined') {
      // During SSR, DOMParser isn't available. Fallback to a hardcoded regex that addresses
      // known edge cases.
      return h.value.replace(/<\/?code[^>]*>/gi, '');
    }
    try {
      return new DOMParser().parseFromString(h.value, 'text/html')?.body?.textContent ?? h.value;
    } catch (e) {
      if (typeof window === 'undefined' || window.location.hostname === 'localhost') {
        console.error(e);
      }
      return h.value;
    }
  });

  slugger.reset();
  const slugs = textHeadings.map(h => slugger.slug(h));

  // The currently-active heading.
  // This needs to start as -1 (instead of some value derived from the URL) to match what SSR
  // generates. The scroll hook below will immediately update this on the client to match any
  // hash in the URL.
  const [currentHeading, setCurrentHeading] = useState(-1);

  // The height of the parent element of the headings.
  // Note that this value isn't necessarily correct. That's okay - we don't actually
  // use its value.
  const [contentHeight, setContentHeight] = useState(0);

  // Update contentHeight so we rerender and re-calculate headerOffsets when necessary.
  // We need to do this because the page's height can change after initial render from things
  // like dynamically loading embeds, for example.
  useLayoutEffect(() => {
    const parent = document.getElementById(slugs[0])?.parentElement;
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
  }, []);

  // Attach a scroll listener on mount to change headings.
  useLayoutEffect(() => {
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

    onScroll();
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
      {headings.map(({ depth }, i) => {
        const slug = slugs[i];
        return (
          <a
            className={cx(`toc-h${depth}`, {
              toc__active: i === currentHeading,
            })}
            href={`#${slug}`}
            key={slug}
          >
            {textHeadings[i]}
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
