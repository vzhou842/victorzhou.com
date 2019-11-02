// @flow
import * as React from 'react';
import RecaptchaContext from '../RecaptchaContext';

type Props = {|
  +children: React.Node,
|};

const TemplateWrapper = (props: Props) => {
  const [hasLoadedRecaptcha, setHasLoadedRecaptcha] = React.useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = React.useState<?string>(null);

  return (
    <RecaptchaContext.Provider
      value={{ hasLoadedRecaptcha, recaptchaToken, setHasLoadedRecaptcha, setRecaptchaToken }}
    >
      {props.children}
    </RecaptchaContext.Provider>
  );
};

export default TemplateWrapper;
