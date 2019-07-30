// @flow
import * as React from 'react';
import styles from './DisplayIf.module.scss';

type Props = {|
  +children: React.Node,
  +mobile?: boolean,
  +desktop?: boolean,
|};

const DisplayIf = ({ children, mobile, desktop }: Props) => (
  <div className={mobile ? styles['mobile-only'] : desktop ? styles['desktop-only'] : ''}>
    {children}
  </div>
);

export default DisplayIf;
