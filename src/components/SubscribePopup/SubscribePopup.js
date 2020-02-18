import { graphql } from 'gatsby';
import React from 'react';

import { logEvent } from '../../utils/log';
import SubscribeForm from '../SubscribeForm';
import styles from './SubscribePopup.module.scss';

const hideDateKey = 'SubscribePopup-hide-date';
const HIDE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

class SubscribePopup extends React.Component {
  state = { visible: false };

  componentDidMount() {
    if (localStorage[hideDateKey] && Date.now() - localStorage[hideDateKey] < HIDE_DURATION) {
      // Still hidden
      return;
    }

    this.scrollListener = () => {
      const threshold = Math.min(Math.max(document.body.offsetHeight / 3, 1500), 4500);
      if (window.scrollY + window.innerHeight / 2 >= threshold) {
        this.setState({ visible: true });
        window.removeEventListener('scroll', this.scrollListener);
        logEvent('SubscribePopup', 'appear');
      }
    };

    window.addEventListener('scroll', this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  close = () => {
    logEvent('SubscribePopup', 'close');
    this.setState({ visible: false });
    localStorage[hideDateKey] = Date.now();
  };

  onKeyDown = e => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  render() {
    const { visible } = this.state;
    const { isML, isWeb, postSlug } = this.props;

    return (
      <div className={`${styles['container']} ${visible ? '' : styles['hidden']}`}>
        <h4 className={styles['title']}>At least this isn't a full screen popup</h4>
        <p className={styles['description']}>
          That would be more annoying. Anyways, consider subscribing to my newsletter to{' '}
          <b>get new posts by email!</b> I write about ML, Web Dev, and more.
        </p>
        <SubscribeForm
          signupSource={`Popup:${postSlug}`}
          isML={isML}
          isWeb={isWeb}
          noDescription
          noSpacing
          onKeyDown={this.onKeyDown}
        />
        <button className={styles['close']} onClick={this.close}>
          ✕
        </button>
      </div>
    );
  }
}

export const fragment = graphql`
  fragment SubscribePopupFragment on MarkdownRemarkFrontmatter {
    ...SubscribeFormFragment
    slug
  }
`;

export default SubscribePopup;
