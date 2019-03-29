import React from 'react';
import ReactCommento from './ReactCommento';

export class Comments extends React.PureComponent {
  state = { show: false };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.setState({ show: true });
    window.removeEventListener('scroll', this.onScroll);
  };

  render() {
    if (!this.state.show) {
      return <div style={{ paddingBottom: '320px' }} />;
    }

    return (
      <ReactCommento />
    );
  }
}

export default Comments;
