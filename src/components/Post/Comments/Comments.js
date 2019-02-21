import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import ReactDisqusComments from 'react-disqus-comments';

export class CommentsContainer extends React.PureComponent {
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
    const { data, postTitle, postSlug, identifier } = this.props;
    const {
      url,
      disqusShortname
    } = data.site.siteMetadata;

    if (!disqusShortname || !this.state.show) {
      return null;
    }

    return (
      <ReactDisqusComments
        shortname={disqusShortname}
        identifier={identifier || postTitle}
        title={postTitle}
        url={url + postSlug}
      />
    );
  }
}

export const Comments = (props) => (
  <StaticQuery
    query={graphql`
      query CommentsQuery {
        site {
          siteMetadata {
            disqusShortname
            url
          }
        }
      }
    `}
    render={(data) => <CommentsContainer {...props} data={data}/>}
  />
);

export default Comments;
