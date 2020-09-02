import classNames from 'classnames/bind';
import React, { useState } from 'react';
import Headroom from 'react-headroom';

import { getIcon } from '../../utils';
import Author from '../Author';
import DarkModeToggle from '../DarkModeToggle';
import DisplayIf from '../DisplayIf';
import Icon from '../Icon';
import Menu from '../Menu';
import styles from './NavHeader.module.scss';

const cx = classNames.bind(styles);

function NavHeader() {
  const [menuShown, setMenuShown] = useState(false);

  return (
    <Headroom
      onUnpin={() => {
        setMenuShown(false);
      }}
    >
      <div className={cx({ header: true, 'no-shadow': menuShown })}>
        <DisplayIf desktop className={styles['header__left']}>
          <Author />
        </DisplayIf>
        <DisplayIf mobile className={`${styles['header__left']} ${styles['mobile']}`}>
          <Author small />
        </DisplayIf>
        <DisplayIf desktop className={styles['header__right']}>
          <Menu horizontal bold />
          <div className={styles['dark-mode-toggle']}>
            <DarkModeToggle />
          </div>
        </DisplayIf>
        <DisplayIf mobile className={`${styles['dark-mode-toggle']} ${styles['mobile']}`}>
          <DarkModeToggle />
        </DisplayIf>
        <DisplayIf mobile>
          <button
            onClick={() => {
              setMenuShown(!menuShown);
            }}
            className={cx({ header__burger: true, open: menuShown })}
          >
            <Icon name="menu" icon={getIcon('menu')} />
          </button>
        </DisplayIf>
      </div>
      {menuShown && (
        <DisplayIf mobile className={styles['popup']}>
          <Menu bold noMargin />
        </DisplayIf>
      )}
    </Headroom>
  );
}

export default NavHeader;
