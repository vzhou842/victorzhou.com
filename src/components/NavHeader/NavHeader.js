import React from 'react';
import { withPrefix, Link } from 'gatsby';
import Menu from '../Menu';
import styles from './NavHeader.module.scss';

const NavHeader = ({ author }) => (
  <div className={styles['header']}>
    <div className={styles['header__left']}>
      <Link to="/" className={styles['header__left-photo']}>
        <img
          src={withPrefix(author.photo)}
          width="50"
          height="50"
          alt={author.name}
        />
      </Link>
      <h4 className={styles['header__left-name']}>
        <Link className={styles['header__left-name-link']} to="/">{author.name}</Link>
      </h4>
    </div>
    <div className={styles['header__right']}>
      <Menu horizontal bold />
    </div>
  </div>
);

export default NavHeader;
