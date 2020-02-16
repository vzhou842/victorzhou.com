// @flow

const __DEV__ =
  typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost';

export function logEvent(category: string, action: string) {
  if (window.gtag) {
    window.gtag('event', action, { event_category: category });
  }
  if (__DEV__) {
    console.log(category, action);
  }
}

export function logError(description: string) {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description,
      fatal: false,
    });
  }
  if (__DEV__) {
    console.error(description);
  }
}
