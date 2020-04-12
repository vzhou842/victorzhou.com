// @flow
import React, { useCallback } from 'react';

import styles from './CSRFPostButton.module.scss';

// Props have to be lowercase and are strings b/c this component is used in markdown.
type Props = $ReadOnly<{|
  children: string,
  'use-get-request': string,
|}>;

export default function CSRFPostButton(props: Props) {
  const useGetRequest = props['use-get-request'] === 'true';

  const onClick = useCallback(() => {
    let fetchPromise;
    if (useGetRequest) {
      fetchPromise = fetch('http://localhost:3000/transfer?amount=100&description=gettest');
    } else {
      fetchPromise = fetch('http://localhost:3000/transfer', {
        credentials: 'include',
        method: 'post',
        mode: 'no-cors',
        body: new URLSearchParams('amount=100&description=test'),
      });
    }
    fetchPromise
      .then(response => response.json())
      .then(updatedUser => {
        // eslint-disable-next-line no-alert
        alert(updatedUser);
      })
      .catch(console.error);
  }, [useGetRequest]);

  return (
    <div className={styles['wrapper']}>
      <button className={styles['button']} onClick={onClick}>
        {props.children}
      </button>
    </div>
  );
}
