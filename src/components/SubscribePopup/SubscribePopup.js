import React from 'react';
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
      const threshold = Math.min(Math.max(document.body.offsetHeight / 2, 2000), 6000);
      if (window.scrollY + window.innerHeight / 2 >= threshold) {
        this.setState({ visible: true });
        window.removeEventListener('scroll', this.scrollListener);
      }
    };
    if (window.innerWidth >= 720) {
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  close = () => {
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

    return (
      <div className={`${styles['container']} ${visible ? '' : styles['hidden']}`}>
        <h4 className={styles['title']}>At least this isn't a full screen popup</h4>
        <p className={styles['description']}>
          That would be more annoying. Anyways, if you like what you're reading, consider
          subscribing to my newsletter! I'll notify you when I publish new posts - no spam.
        </p>
        <SubscribeForm
          signupSource={`Popup:${this.props.postSlug}`}
          lists={this.props.lists}
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

export default SubscribePopup;
