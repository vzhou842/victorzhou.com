// @flow
import * as React from 'react';

export default class ReactCommento extends React.PureComponent<{||}> {
  _script: ?HTMLScriptElement = null;

  componentDidMount() {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//cdn.commento.io/js/commento.js';
    script.setAttribute('data-css-override', '/commento.min.css');

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    this._script = script;
  }

  componentWillUnmount() {
    if (this._script) {
      this._script.remove();
      this._script = null;
    }
  }

  render() {
    return <div id="commento" />;
  }
}
