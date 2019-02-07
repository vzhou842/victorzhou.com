import React from 'react';
import styles from './DisplayIf.module.scss';

const DisplayIf = ({ children, mobile, desktop }) => (
  <div className={mobile ? styles['mobile-only'] : (desktop ? styles['desktop-only'] : '')}>
    {children}
  </div>
);

export default DisplayIf;
