import React, { useState } from 'react';
import classNames from 'classnames/bind';
import Headroom from 'react-headroom';
import styles from './NavHeader.module.scss';

import Author from '../Author';
import DisplayIf from '../DisplayIf';
import Menu from '../Menu';

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
        <div className={styles['header__left']}>
          <Author />
        </div>
        <DisplayIf desktop className={styles['header__right']}>
          <Menu horizontal bold />
        </DisplayIf>
        <DisplayIf mobile>
          <button
            onClick={() => {
              setMenuShown(!menuShown);
            }}
            className={cx({ header__burger: true, open: menuShown })}
          >
            <img src="/menu.svg" width={28} height={28} />
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
