// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

type Props = {|
  +children: React.Node,
  +mobile?: boolean,
  +desktop?: boolean,
|};

// Should match $layout-breakpoint-sm
const MOBILE_WIDTH_THRESHOLD = 685;

const calcIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_WIDTH_THRESHOLD;

const DisplayIf = ({ children, mobile, desktop }: Props) => {
  const [isMobile, setIsMobile] = useState(calcIsMobile());

  useEffect(() => {
    const listener = () => {
      setIsMobile(calcIsMobile());
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  if ((mobile && isMobile) || (desktop && !isMobile)) {
    return children;
  }
  return null;
};

export default DisplayIf;
