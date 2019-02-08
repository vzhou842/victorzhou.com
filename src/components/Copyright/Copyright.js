import React from 'react';
import styles from './Copyright.module.scss';

const Copyright = ({ copyright }) => (
  <p className={styles['copyright']}>
    {copyright}
  </p>
);

export default Copyright;
