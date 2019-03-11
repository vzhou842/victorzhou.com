import React from 'react';
import './CarbonAd.css';
import styles from './CarbonAd.module.scss';

class CarbonAd extends React.PureComponent {
  componentDidMount() {
    const { minDisplayWidth } = this.props;
    if (!minDisplayWidth || (minDisplayWidth && window.innerWidth >= minDisplayWidth)) {
      const container = document.getElementById('carbonads-container');
      const script = document.createElement('script');
      script.id = '_carbonads_js';
      script.async = true;
      script.src = '//cdn.carbonads.com/carbon.js?serve=CK7I4237&placement=victorzhoucom';
      container.appendChild(script);
    }
  }

  render() {
    return (
      <div id='carbonads-container' className={styles['container']} />
    );
  }
}

export default CarbonAd;
