import { Link, NavLink } from 'react-router-dom';
import styles from './Layout.module.css';
import Logo from '../../logo.svg';
import React from 'react';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <span>Meal Explorer</span>
        </Link>
        <nav className={styles.nav}>
          <NavLink
            to="/list"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            List
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Gallery
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>
          Data: TheMealDB.com • MP2 • React + TypeScript + Axios + Router
        </span>
      </footer>
    </div>
  );
};
export default Layout;
