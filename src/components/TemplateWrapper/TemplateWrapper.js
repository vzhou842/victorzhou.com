// @flow
import * as React from 'react';

type Props = {|
  +children: React.Node,
|};

const TemplateWrapper = (props: Props) => props.children;

export default TemplateWrapper;
