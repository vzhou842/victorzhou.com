// @flow
import './DarkModeToggle.module.scss';

import React, { useCallback, useEffect, useState } from 'react';
import Toggle from 'react-toggle';

const DarkModeToggle = () => {
  const [checked, setChecked] = useState(window.__theme === 'dark');
  const onChange = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setChecked(isChecked);
      window.__setPreferredTheme(isChecked ? 'dark' : 'light');
    },
    [setChecked]
  );

  useEffect(() => {
    const listener = () => {
      setChecked(window.__theme === 'dark');
    };
    window.__themeListeners.push(listener);

    return () => {
      window.__themeListeners = window.__themeListeners.filter(l => l !== listener);
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
