// @flow
import moment from 'moment';

export const renderDate = (date: Date) => moment(date).format('MMMM D, YYYY');
