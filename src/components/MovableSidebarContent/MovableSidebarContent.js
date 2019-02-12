import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import SubscribeForm from '../SubscribeForm';
import Contacts from '../Contacts';
import Copyright from '../Copyright';
import DisplayIf from '../DisplayIf';

export const PureMovableSidebarContent = ({ mobile, desktop, data }) => {
  const { author, copyright } = data.site.siteMetadata;
  return (
    <DisplayIf mobile={mobile} desktop={desktop}>
      <SubscribeForm />
      <Contacts contacts={author.contacts} />
      <Copyright copyright={copyright} />
    </DisplayIf>
  );
};

export const MovableSidebarContent = props => (
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
