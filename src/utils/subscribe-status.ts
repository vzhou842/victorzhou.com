import { logEvent } from './log';

const KEY = 'USER_HAS_SUBSCRIBED';
const storage: Record<string, string> = typeof localStorage !== 'undefined' ? localStorage : {};

let hasLogged = false;

export const setUserHasSubscribed = () => {
  storage[KEY] = '1';
};

export const userHasSubscribed = () => {
  const ret = !!storage[KEY];
  if (!hasLogged && ret) {
    hasLogged = true;
    logEvent('subscribe-status', 'session-with-subscribed-user');
  }
  return ret;
};
