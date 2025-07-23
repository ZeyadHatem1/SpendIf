// src/App.jsx
import React from 'react';
import './App.css'; // optional for styling

function App() {
  return (
    <div style={styles.wrapper}>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li><a href="#" style={styles.link}>Dashboard</a></li>
          <li><a href="#" style={styles.link}>Upload</a></li>
          <li><a href="#" style={styles.link}>Analytics</a></li>
          <li><a href="#" style={styles.link}>Security</a></li>
          <li><a href="#" style={styles.link}>Statistics</a></li>
        </ul>
      </nav>

      <div style={styles.content}>
        <main style={styles.main}>
          <u><h1>Welcome to SpendIf</h1></u>
          <h2>Your own financial tracker</h2>
          {/* Your other components can go here */}
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
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: '220px',
  },
  navbar: {
    backgroundColor: '#fbfafaff',
    padding: '2rem 1rem',
    height: '100vh',
    width: '200px',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  main: {
    padding: '2rem',
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f1f1f1',
  }
};

export default App;
