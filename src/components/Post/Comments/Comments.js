// @flow
import * as React from 'react';

import ReactCommento from './ReactCommento';

type State = {|
  +show: boolean,
|};

export default class Comments extends React.PureComponent<{||}, State> {
  state = { show: false };

  timeout: ?TimeoutID;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.timeout = setTimeout(this.onScroll, 5000);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    clearTimeout(this.timeout);
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
