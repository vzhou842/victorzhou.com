// @flow
import './DarkModeToggle.module.scss';

import React from 'react';
import Toggle from 'react-toggle';

const DarkModeToggle = () => (
  <Toggle
    defaultChecked={false}
    icons={{
      checked: <img src="/media/moon.svg" alt="dark mode" />,
      unchecked: <img src="/media/sun.svg" alt="light mode" />,
    }}
    onChange={null}
  />
);

export default DarkModeToggle;
