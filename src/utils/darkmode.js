// @flow

// getTheme() can technically be run before window.__theme is set
export function getTheme(): ?string {
  return typeof window === 'undefined' ? 'light' : window.__theme;
}

export function setPreferredTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') {
    return;
  }
  window.__setPreferredTheme(theme);
}

export function addThemeListener(listener: () => void) {
  if (typeof window === 'undefined' || !window.__themeListeners) {
    return;
  }
  window.__themeListeners.push(listener);
}

export function removeThemeListener(listener: () => void) {
  if (typeof window === 'undefined' || !window.__themeListeners) {
    return;
  }
  window.__themeListeners = window.__themeListeners.filter(l => l !== listener);
}
