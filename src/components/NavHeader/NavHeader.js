import React from 'react';
import Headroom from 'react-headroom';
import styles from './NavHeader.module.scss';

import Author from '../Author';
import Menu from '../Menu';

const NavHeader = () => (
  <Headroom>
    <div className={styles['header']}>
      <div className={styles['header__left']}>
        <Author />
      </div>
      <div className={styles['header__right']}>
        <Menu horizontal bold />
      </div>
    </div>
  </Headroom>
);

export default NavHeader;
