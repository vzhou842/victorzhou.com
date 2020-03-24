// @flow
import classnames from 'classnames/bind';
import { Link } from 'gatsby';
import React from 'react';

import styles from './SortBySelector.module.scss';

const cx = classnames.bind(styles);

type Props = $ReadOnly<{|
  sortByNew: boolean,
|}>;

const SortBySelector = ({ sortByNew }: Props) => (
  <div className={styles['root']}>
    <ul>
      <li>
        <Link className={cx({ link: true, selected: sortByNew })} to="/">
          New
        </Link>
      </li>
      <li>
        <Link className={cx({ link: true, selected: !sortByNew })} to="/top/">
          Top
        </Link>
      </li>
    </ul>
  </div>
);

export default SortBySelector;
