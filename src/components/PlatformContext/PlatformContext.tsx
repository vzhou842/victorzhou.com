import React, { ReactElement, useEffect, useState } from 'react';

interface Props {
  render: (isMobile: boolean) => ReactElement | null;
  threshold?: number | null;
}

// Should match $layout-breakpoint-sm
const MOBILE_WIDTH_THRESHOLD = 685;

const calcIsMobile = (t: number | null | undefined) => {
  const threshold = t != null ? t : MOBILE_WIDTH_THRESHOLD;
  return typeof window !== 'undefined' && window.innerWidth <= threshold;
};

const PlatformContext = ({ render, threshold }: Props) => {
  const [isMobile, setIsMobile] = useState(calcIsMobile(threshold));

  useEffect(() => {
    const listener = () => {
      setIsMobile(calcIsMobile(threshold));
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return render(isMobile);
};

export default PlatformContext;
