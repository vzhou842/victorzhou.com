import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import styles from './Menu.module.scss';

export const PureMenu = ({ data, horizontal, bold }) => {
  const { menu } = data.site.siteMetadata;
  return (
    <nav className={horizontal ? `${styles['menu']} ${styles['horizontal']}` : styles['menu']}>
      <ul className={styles['menu__list']}>
        {menu.map((item) => (
          <li className={styles['menu__list-item']} key={item.path}>
            <Link
              to={item.path}
              className={styles['menu__list-item-link'] + (bold ? ` ${styles['bold']}` : '')}
              activeClassName={styles['menu__list-item-link--active']}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const Menu = props => (
  <StaticQuery
    query={graphql`
      query MenuQuery {
        site {
          siteMetadata {
            menu {
              label
              path
            }
          }
        }
      }
    `}
    render={data => <PureMenu {...props} data={data} />}
  />
);

export default Menu;
