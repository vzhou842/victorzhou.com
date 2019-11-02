// @flow strict

const SITE_KEY = '6Lerzb4UAAAAAC8uj1xAFg0L4p23m6ruvPQXPblP';

let initPromise = null;

export async function initializeRecaptcha() {
  if (initPromise === null) {
    const readyPromise = new Promise(resolve => {
      window.onGRecaptchaLoad = () => {
        window.grecaptcha.ready(resolve);
      };
    });

    initPromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onGRecaptchaLoad&render=${SITE_KEY}`;
      script.onload = resolve;
      if (document.body) {
        document.body.appendChild(script);
      }
    }).then(() => readyPromise);
  }
  return initPromise;
}

export async function executeAction(action: string) {
  await initializeRecaptcha();
  return window.grecaptcha.execute(SITE_KEY, { action });
}
