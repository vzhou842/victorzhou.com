import { logError, logEvent } from './log';

let hasLoadedRecaptcha = false;
let hasPlacedStyle = false;
let script = null;

export function loadRecaptchaIfNeeded() {
  if (!hasPlacedStyle) {
    hasPlacedStyle = true;
    if (document.head) {
      const style = document.createElement('style');
      style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
      document.head.appendChild(style);
    } else {
      logError("[recaptcha] <head> doesn't exist");
    }
  }

  if (!hasLoadedRecaptcha) {
    hasLoadedRecaptcha = true;
    if (document.body) {
      script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      logError("[recaptcha] <body> doesn't exist");
    }
  }
}

export async function detectRecaptchaSetup() {
  loadRecaptchaIfNeeded();

  if (!window.grecaptcha || !window.grecaptcha.execute) {
    logEvent('recaptcha', 'recaptcha-not-setup');
    return new Promise(resolve => {
      const intervalReturn = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.execute) {
          clearInterval(intervalReturn);
          resolve();
        }
      }, 50);
    });
  }

  logEvent('recaptcha', 'recaptcha-already-setup');
  return undefined;
}

export function cleanupRecaptcha() {
  hasLoadedRecaptcha = false;
  if (script) {
    script.remove();
    script = null;
  }
}
