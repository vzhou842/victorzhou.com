// @flow
import './DarkModeToggle.module.scss';

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Toggle from 'react-toggle';

import {
  addThemeListener,
  getTheme,
  removeThemeListener,
  setPreferredTheme,
} from '../../utils/darkmode';

const ICONS = {
  checked: <img src="/media/moon.svg" alt="dark mode" />,
  unchecked: <img src="/media/sun.svg" alt="light mode" />,
};

const DarkModeToggle = () => {
  const [checked, setChecked] = useState(getTheme() === 'dark');

  // Never server-side render this, since we can't determine
  // the correct initial state until we get to the client.
  const [hasMounted, setHasMounted] = useState(false);

  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  const onChange = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setChecked(isChecked);
      setPreferredTheme(isChecked ? 'dark' : 'light');
    },
    [setChecked]
  );

  useEffect(() => {
    const listener = () => {
      setChecked(getTheme() === 'dark');
    };
    addThemeListener(listener);

    return () => {
      removeThemeListener(listener);
    };
  }, [setChecked]);

  if (!hasMounted) {
    return <div style={{ width: 50 }} />;
  }

  return <Toggle checked={checked} icons={ICONS} onChange={onChange} />;
};

export default DarkModeToggle;
