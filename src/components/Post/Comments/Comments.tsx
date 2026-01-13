import React from 'react';

import ReactCommento from './ReactCommento';

interface State {
  show: boolean;
}

export default class Comments extends React.PureComponent<Record<string, never>, State> {
  state: State = { show: false };

  timeout: ReturnType<typeof setTimeout> | undefined;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.timeout = setTimeout(this.onScroll, 5000);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onScroll = () => {
    this.setState({ show: true });
    window.removeEventListener('scroll', this.onScroll);
  };

  render() {
    if (!this.state.show) {
      return <div style={{ paddingBottom: '320px' }} />;
    }

    return <ReactCommento />;
  }
}
