// src/App.jsx
import React from 'react';
import './App.css'; // optional for styling

function App() {
  return (
    <>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Upload</a></li>
          <li><a href="#">Analytics</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">Statistics</a></li>
        </ul>
      </nav>

      <main>
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
    padding: '1rem 2rem',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '2rem',
    margin: 0,
    padding: 0,
    color: 'white',
  }
};

export default App;
