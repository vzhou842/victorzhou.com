// @flow
import classnames from 'classnames/bind';
import * as React from 'react';

import PlatformContext from '../PlatformContext';
import styles from './DisplayIf.module.scss';

const cx = classnames.bind(styles);

type Props = {|
  +children: React.Node,
  +className?: string,
  +mobile?: boolean,
  +desktop?: boolean,
|};

const DisplayIf = ({ children, className, mobile, desktop }: Props) => (
  // Use PlatformContext's default value for the threshold prop because it matches the CSS.
  <PlatformContext
    render={isMobile =>
      (mobile && isMobile) || (desktop && !isMobile) ? (
        <div
          className={
            cx({ 'mobile-only': mobile, 'desktop-only': desktop }) +
            (className ? ` ${className}` : '')
          }
        >
          {children}
        </div>
      ) : null
    }
  />
);

export default DisplayIf;
