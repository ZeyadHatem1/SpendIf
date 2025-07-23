// src/App.jsx
import React from 'react';
import './App.css'; // optional for styling

function App() {
  return (
    <>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li><a href="#" style={styles.link}>Dashboard</a></li>
          <li><a href="#" style={styles.link}>Upload</a></li>
          <li><a href="#" style={styles.link}>Analytics</a></li>
          <li><a href="#" style={styles.link}>Security</a></li>
          <li><a href="#" style={styles.link}>Statistics</a></li>
        </ul>
      </nav>

      <main style={styles.main}>
        <u><h1>Welcome to SpendIf</h1></u>
        <h2>Your own financial tracker</h2>
        {/* Your other components can go here */}
      </main>
    </>
  );
}

const styles = {
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
    marginLeft: '220px',
    padding: '2rem',
  }
};

export default App;
