// @flow
import React from 'react';
import styles from './ContentDate.module.scss';
import { renderDate } from '../../utils/date';

const dateToTime = date => <time>{renderDate(date)}</time>;

type Props = {|
  +date: Date,
  +dateModified: ?Date,
|};

const ContentDate = ({ date, dateModified }: Props) => (
  <p className={styles['content-date']}>
    {dateToTime(date)}
    {dateModified && (
      <span className={styles['date-modified']}>
        &ensp;|&ensp;UPDATED {dateToTime(dateModified)}
      </span>
    )}
  </p>
);

export default ContentDate;
