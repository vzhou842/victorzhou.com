import React from 'react';
import SubscribeForm from '../SubscribeForm';
import styles from './SubscribePopup.module.scss';

const inputId = 'subscribe-popup-input';

class SubscribePopup extends React.Component {
  state = { visible: false };

  componentDidMount() {
    this.scrollListener = () => {
      const threshold = Math.min(Math.max(document.body.offsetHeight / 2, 2000), 10000);
      if (window.scrollY + window.innerHeight / 2 >= threshold) {
        this.setState({ visible: true });
        window.removeEventListener('scroll', this.scrollListener);
        document.getElementById(inputId).focus();
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
          noDescription
          noSpacing
          inputId={inputId}
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
