// @flow
import React from 'react';

export type RecaptchaContextType = {|
  hasLoadedRecaptcha: boolean,
  recaptchaToken: ?string,
  setHasLoadedRecaptcha: boolean => void,
  setRecaptchaToken: ?string => void,
|};

const RecaptchaContext = React.createContext<RecaptchaContextType>({
  hasLoadedRecaptcha: false,
  recaptchaToken: null,
  setHasLoadedRecaptcha: () => {},
  setRecaptchaToken: () => {},
});

export default RecaptchaContext;
