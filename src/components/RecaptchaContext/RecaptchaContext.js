// @flow
import React from 'react';

export type RecaptchaContextType = {|
  recaptchaToken: ?string,
  setRecaptchaToken: (?string) => void,
|};

const RecaptchaContext = React.createContext<RecaptchaContextType>({
  recaptchaToken: null,
  setRecaptchaToken: () => {},
});

export default RecaptchaContext;
