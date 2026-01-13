declare global {
  interface Window {
    __theme: string | undefined;
    __setPreferredTheme: (theme: 'light' | 'dark') => void;
    __themeListeners: Array<() => void>;
    onSubscribeFormSubmit?: (token: string) => void;
    grecaptcha?: { execute?: () => Promise<string> };
  }
}

export {};
