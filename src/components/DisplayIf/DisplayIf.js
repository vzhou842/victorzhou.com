// @flow
import * as React from 'react';

import PlatformContext from '../PlatformContext';

type Props = {|
  +children: React.Node,
  +mobile?: boolean,
  +desktop?: boolean,
|};

const DisplayIf = ({ children, mobile, desktop }: Props) => (
  <PlatformContext render={isMobile => (
    ((mobile && isMobile) || (desktop && !isMobile)) ?
      children :
      null
  )} />
);

export default DisplayIf;
