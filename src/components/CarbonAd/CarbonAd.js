import React from 'react';
import './CarbonAd.css';
import styles from './CBA.module.scss';
import styleVars from '../../assets/scss/_variables.scss';

function thresholdFromStyle(key) {
  return parseInt(styleVars[key].replace('px', ''), 10);
}

const SMALL_THRESHOLD = thresholdFromStyle('layout-breakpoint-sm');
const LARGE_THRESHOLD = thresholdFromStyle('layout-breakpoint-lg');

class CarbonAd extends React.PureComponent {
  componentDidMount() {
    if (this.shouldDisplay()) {
      const container = document.getElementById('cba-container');
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
    return this.shouldDisplay() ? (
      <div
        id="cba-container"
        className={
          largeOnly ? styles['container-large'] : smallOnly ? styles['container-small'] : null
        }
      />
    ) : null;
  }
}

export default CarbonAd;
