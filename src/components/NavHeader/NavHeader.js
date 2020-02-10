import React, { useState } from 'react';
import classNames from 'classnames/bind';
import Headroom from 'react-headroom';
import styles from './NavHeader.module.scss';

import Author from '../Author';
import PlatformContext from '../PlatformContext';
import Menu from '../Menu';

const cx = classNames.bind(styles);

function NavHeader() {
  const [menuShown, setMenuShown] = useState(false);

  return (
    <PlatformContext render={isMobile => (
      <Headroom onUnpin={() => { setMenuShown(false); }}>
        <div className={cx({ header: true, 'no-shadow': menuShown })}>
          <div className={styles['header__left']}>
            <Author />
          </div>
          {isMobile ? (
            <button
              onClick={() => { setMenuShown(!menuShown); }}
              className={cx({ header__burger: true, open: menuShown })}>
              <img src="/menu.svg" width={28} height={28} />
            </button>
          ) : (
            <div className={styles['header__right']}>
              <Menu horizontal bold />
            </div>
          )}
        </div>
        {isMobile && menuShown && (
          <div className={styles['popup']}>
            <Menu bold noMargin />
          </div>
        )}
      </Headroom>
    )} />
  );
}

export default NavHeader;
