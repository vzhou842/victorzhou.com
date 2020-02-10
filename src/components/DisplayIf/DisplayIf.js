// @flow
import * as React from 'react';
import classnames from 'classnames/bind';
import styles from './DisplayIf.module.scss';

import PlatformContext from '../PlatformContext';

const cx = classnames.bind(styles);

type Props = {|
  +children: React.Node,
  +className?: string,
  +mobile?: boolean,
  +desktop?: boolean,
|};

const DisplayIf = ({ children, className, mobile, desktop }: Props) => (
  <PlatformContext render={isMobile => (
    ((mobile && isMobile) || (desktop && !isMobile)) ? (
      <div className={
        cx({ 'mobile-only': mobile, 'desktop-only': desktop }) +
        (className ? ` ${className}` : '')
      }>
        {children}
      </div>
    ) : null
  )} />
);

export default DisplayIf;
