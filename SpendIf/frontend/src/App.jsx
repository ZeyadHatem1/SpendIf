import React, { useState } from 'react';
import {
  FiHome,
  FiUpload,
  FiTrendingUp,
  FiShield,
  FiBarChart2,
  FiMenu,
  FiX,
} from 'react-icons/fi';

function App() {
  const [active, setActive] = useState('Dashboard');
  const [hovered, setHovered] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome /> },
    { name: 'Upload', icon: <FiUpload /> },
    { name: 'Analytics', icon: <FiTrendingUp /> },
    { name: 'Security', icon: <FiShield /> },
    { name: 'Statistics', icon: <FiBarChart2 /> },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Menu button (only shows when navbar is closed) */}
      {!showNavbar && (
        <button
          onClick={() => setShowNavbar(true)}
          style={{ ...styles.menuButton, color: 'black' }}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Conditionally render navbar */}
      {showNavbar && (
        <>
          <nav style={styles.navbar}>
            <ul style={styles.navList}>
              {menuItems.map(item => (
                <li
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    ...styles.navItem,
                    ...(active === item.name ? styles.activeNavItem : {}),
                    ...(hovered === item.name && active !== item.name
                      ? styles.hoverNavItem
                      : {}),
                  }}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </nav>

          {/* X (close) button next to navbar */}
          <button
            onClick={() => setShowNavbar(false)}
            style={styles.closeButton}
          >
            <FiX size={24} />
          </button>
        </>
      )}

      <div style={styles.content}>
        <main style={styles.main}>
          <h1>{active}</h1>
          <p>Welcome to the {active} section of SpendIf.</p>
        </main>
        <footer style={styles.footer}>
          <p>&copy; 2025 SpendIf. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  menuButton: {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000,
    color: 'black',
  },
  closeButton: {
    position: 'fixed',
    top: '1rem',
    left: '210px', // right next to the navbar
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000,
    color: 'black',
  },
  navbar: {
    backgroundColor: '#ffffff',
    padding: '1rem 0.5rem',
    width: '200px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #eee',
    zIndex: 999,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    color: '#4B5563',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
  },
  activeNavItem: {
    backgroundColor: '#0369A1',
    color: '#ffffff',
  },
  hoverNavItem: {
    backgroundColor: '#E5E7EB',
  },
  icon: {
    fontSize: '1.2rem',
  },
  content: {
    marginLeft: '220px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f1f1f1',
  },
};

export default App;
