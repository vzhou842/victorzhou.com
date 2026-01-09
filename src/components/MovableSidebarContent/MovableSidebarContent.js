// @flow
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';

import Contacts from '../Contacts';
import Copyright from '../Copyright';
import DisplayIf from '../DisplayIf';
import SubscribeForm from '../SubscribeForm';

type Props = {
  +mobile?: boolean,
  +desktop?: boolean,
  +hideSubscribeForm?: boolean,
};

type PureProps = Props & {
  +data: Object,
};

export const PureMovableSidebarContent = ({
  mobile,
  desktop,
  hideSubscribeForm,
  data,
}: PureProps) => {
  const { author, copyright } = data.site.siteMetadata;
  return (
    <DisplayIf mobile={mobile} desktop={desktop}>
      {!hideSubscribeForm && (
        <SubscribeForm signupSource={`Sidebar:${mobile ? 'mobile' : 'desktop'}`} />
      )}
      <Contacts contacts={author.contacts} />
      <Copyright copyright={copyright} />
    </DisplayIf>
  );
};

export const MovableSidebarContent = (props: Props) => (
  <StaticQuery
    query={graphql`
      query MovableSidebarContentQuery {
        site {
          siteMetadata {
            author {
              contacts {
                twitter
                github
                email
                rss
              }
            }
            copyright
          }
        }
      }
    `}
    render={data => <PureMovableSidebarContent {...props} data={data} />}
  />
);

export default MovableSidebarContent;
