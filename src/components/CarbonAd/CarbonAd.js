import React from 'react';
import './CarbonAd.css';
import styles from './CBA.module.scss';

const SMALL_THRESHOLD = 685; // $layout-breakpoint-sm
const LARGE_THRESHOLD = 1100; // $layout-breakpoint-lg

class CarbonAd extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    if (this.shouldDisplay()) {
      const container = this.ref.current;
      const script = document.createElement('script');
      script.id = '_carbonads_js';
      script.async = true;
      script.src = '//cdn.carbonads.com/carbon.js?serve=CK7I4237&placement=victorzhoucom';
      container.appendChild(script);
    }
  }

  shouldDisplay() {
    const { smallOnly, largeOnly } = this.props;
    return (
      (!largeOnly || (largeOnly && window.innerWidth >= LARGE_THRESHOLD)) &&
      (!smallOnly || (smallOnly && window.innerWidth <= SMALL_THRESHOLD)) &&
      window.location.hostname !== 'localhost'
    );
  }

  render() {
    const { smallOnly, largeOnly } = this.props;
    return (
      <div
        ref={this.ref}
        className={
          largeOnly ? styles['container-large'] : smallOnly ? styles['container-small'] : null
        }
      />
    );
  }
}

export default CarbonAd;
