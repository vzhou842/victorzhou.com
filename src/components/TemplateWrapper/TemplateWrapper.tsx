import React, { ReactNode, useState } from 'react';

import RecaptchaContext from '../RecaptchaContext';

interface Props {
  children: ReactNode;
}

const TemplateWrapper = (props: Props) => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  return (
    <RecaptchaContext.Provider value={{ recaptchaToken, setRecaptchaToken }}>
      {props.children}
    </RecaptchaContext.Provider>
  );
};

export default TemplateWrapper;
