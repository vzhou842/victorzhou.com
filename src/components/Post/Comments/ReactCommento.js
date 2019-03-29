import React from 'react';

export default class ReactCommento extends React.PureComponent {
  componentDidMount() {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//cdn.commento.io/js/commento.js';

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }

  render() {
    return (
      <div id="commento" />
    );
  }
}
