import React from 'react';
import styles from './NavHeader.module.scss';

import Author from '../Author';
import Menu from '../Menu';

const NavHeader = () => (
  <div className={styles['header']}>
    <div className={styles['header__left']}>
      <Author />
    </div>
    <div className={styles['header__right']}>
      <Menu horizontal bold />
    </div>
  </div>
);

export default NavHeader;
