// @flow
import React, { useCallback } from 'react';

import styles from './CSRFPostButton.module.scss';

// Props have to be lowercase and are strings b/c this component is used in markdown.
type Props = $ReadOnly<{|
  children: string,
|}>;

export default function CSRFPostButton(props: Props) {
  const onClick = useCallback(() => {
    fetch('https://dsb.victorzhou.com/transfer', {
      credentials: 'include',
      method: 'post',
      mode: 'no-cors',
      body: new URLSearchParams('amount=100&description=test'),
    })
      .then(response => response.json())
      .then(updatedUser => {
        // eslint-disable-next-line no-alert
        alert(updatedUser);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles['wrapper']}>
      <button className={styles['button']} onClick={onClick}>
        {props.children}
      </button>
    </div>
  );
}
