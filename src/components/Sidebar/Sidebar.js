import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Author from './Author';
import Menu from '../Menu';
import MovableSidebarContent from '../MovableSidebarContent';
import styles from './Sidebar.module.scss';

export const PureSidebar = ({ data }) => {
  const {
    author,
  } = data.site.siteMetadata;

  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <Author author={author} />
        <Menu />
        <MovableSidebarContent desktop />
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
            author {
              name
              photo
              bio
            }
          }
        }
      }
    `}
    render={(data) => <PureSidebar {...props} data={data}/>}
  />
);

export default Sidebar;
