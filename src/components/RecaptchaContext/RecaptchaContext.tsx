import React from 'react';

export interface RecaptchaContextType {
  recaptchaToken: string | null;
  setRecaptchaToken: (token: string | null) => void;
}

const RecaptchaContext = React.createContext<RecaptchaContextType>({
  recaptchaToken: null,
  setRecaptchaToken: () => {},
});

export default RecaptchaContext;
