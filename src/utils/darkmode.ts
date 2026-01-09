// getTheme() can technically be run before window.__theme is set
export function getTheme(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.__theme;
}

export function setPreferredTheme(theme: 'light' | 'dark') {
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
