// @flow
import * as React from 'react';

import styles from './FixedScrollContainer.module.scss';

type Props = {|
  +children: React.Node,
|};

const FixedScrollContainer = ({ children }: Props) => (
  <div className={styles['container']}>{children}</div>
);

export default FixedScrollContainer;
