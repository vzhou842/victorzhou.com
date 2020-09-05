// @flow
import './DarkModeToggle.module.scss';

import React, { useCallback, useEffect, useState } from 'react';
import Toggle from 'react-toggle';

import {
  addThemeListener,
  getTheme,
  removeThemeListener,
  setPreferredTheme,
} from '../../utils/darkmode';

const DarkModeToggle = () => {
  const [checked, setChecked] = useState(getTheme() === 'dark');
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

    // Make sure we're synced when the listener is added.
    // The darkmode script in gatbsy-ssr may be run _after_ this component's
    // initial render, so the original value from getTheme() may have been wrong.
    listener();

    addThemeListener(listener);

    return () => {
      removeThemeListener(listener);
    };
  }, [setChecked]);

  return (
    <Toggle
      checked={checked}
      icons={{
        checked: <img src="/media/moon.svg" alt="dark mode" />,
        unchecked: <img src="/media/sun.svg" alt="light mode" />,
      }}
      onChange={onChange}
    />
  );
};

export default DarkModeToggle;
