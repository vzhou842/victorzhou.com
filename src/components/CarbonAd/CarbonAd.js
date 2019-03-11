import React from 'react';
import './CarbonAd.css';
import styles from './CarbonAd.module.scss';

export const CarbonAd = () => (
  <div className={styles['container']}>
    <script
      async
      type="text/javascript"
      src="//cdn.carbonads.com/carbon.js?serve=CK7I4237&placement=victorzhoucom"
      id="_carbonads_js"
    />
  </div>
);

export default CarbonAd;
