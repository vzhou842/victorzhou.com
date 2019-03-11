import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import SubscribeForm from '../SubscribeForm';
import Contacts from '../Contacts';
import Copyright from '../Copyright';
import DisplayIf from '../DisplayIf';
import CarbonAd from '../CarbonAd';

export const PureMovableSidebarContent = ({ mobile, desktop, hideSubscribeForm, data }) => {
  const { author, copyright } = data.site.siteMetadata;
  return (
    <DisplayIf mobile={mobile} desktop={desktop}>
      {!hideSubscribeForm && <SubscribeForm />}
      {desktop && (
        <CarbonAd minDisplayWidth={685} />
      )}
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
