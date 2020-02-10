// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

type Props = {|
  +render: (isMobile: boolean) => React.MixedElement | null,
|};

// Should match $layout-breakpoint-sm
const MOBILE_WIDTH_THRESHOLD = 685;

const calcIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_WIDTH_THRESHOLD;

const PlatformContext = ({ render }: Props) => {
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

  return render(isMobile);
};

export default PlatformContext;
