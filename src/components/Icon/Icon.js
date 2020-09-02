// @flow
import React from 'react';

import styles from './Icon.module.scss';

const Icon = ({ name, icon }: { name: string, icon: { viewBox: string, path: string } }) => (
  <svg className={styles['icon']} viewBox={icon.viewBox}>
    <title>{name}</title>
    <path d={icon.path} />
  </svg>
);

export default Icon;
