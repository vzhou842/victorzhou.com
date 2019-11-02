// @flow

export function logEvent(category: string, action: string) {
  if (window.ga) {
    window.ga('send', 'event', category, action);
  }
}

export function logError(description: string) {
  if (window.ga) {
    window.ga('send', 'exception', {
      exDescription: description,
      exFatal: false,
    });
  }
}
