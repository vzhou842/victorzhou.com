// @flow
import React from 'react';

import styles from './Copyright.module.scss';

type Props = {|
  +copyright: string,
|};

const Copyright = ({ copyright }: Props) => <p className={styles['copyright']}>{copyright}</p>;

export default Copyright;
