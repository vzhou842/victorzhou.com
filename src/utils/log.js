// @flow

export function logEvent(category: string, action: string) {
  if (window.gtag) {
    window.gtag('event', action, { event_category: category });
  }
}

export function logError(description: string) {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description,
      fatal: false,
    });
  }
}
