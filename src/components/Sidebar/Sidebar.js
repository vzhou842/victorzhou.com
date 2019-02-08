import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Author from './Author';
import Menu from '../Menu';
import styles from './Sidebar.module.scss';
import SubscribeForm from '../SubscribeForm';
import Contacts from '../Contacts';
import Copyright from '../Copyright';
import DisplayIf from '../DisplayIf';

export const PureSidebar = ({ data }) => {
  const {
    author,
    copyright,
  } = data.site.siteMetadata;

  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <Author author={author} />
        <Menu />
        <DisplayIf desktop>
          <SubscribeForm />
          <Contacts contacts={author.contacts} />
          <Copyright copyright={copyright} />
        </DisplayIf>
      </div>
    </div>
  );
};

export const Sidebar = (props) => (
  <StaticQuery
    query={graphql`
      query SidebarQuery {
        site {
          siteMetadata {
            title
            subtitle
            copyright
            author {
              name
              photo
              bio
              contacts {
                twitter
                github
                email
              }
            }
          }
        }
      }
    `}
    render={(data) => <PureSidebar {...props} data={data}/>}
  />
);

export default Sidebar;
