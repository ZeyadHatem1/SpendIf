import React, { useState } from "react";
import Authentication from "./Authentication"; // adjust path if needed

const Analytics = ({ data }) => {
  const [showAuth, setShowAuth] = useState(false);

  const recentTransactions = data.slice(-3).reverse(); // Last 3, most recent first

  const handleCardClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuth(true); // show login/signup if not logged in
    } else {
      console.log("Previous Transactions:", data);
      // TODO: navigate to detailed transactions page if you have one
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    console.log("User logged in, now show transactions.");
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          maxWidth: "1200px",   
          minHeight: "500px",   
          width: "100%",
          transition: "all 0.2s ease-in-out",
          transform: "scale(1)",
          margin: "0 auto",     
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", fontSize: "2rem" }}>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p style={{ color: "#6B7280", fontSize: "1.2rem" }}>No previous transactions</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recentTransactions.map((t, index) => (
              <li
                key={index}
                style={{
                  borderBottom: index < recentTransactions.length - 1 ? "1px solid #eee" : "none",
                  padding: "1rem 0",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>{t.description}</div>
                <div style={{ fontSize: "1rem", color: "#6B7280", marginTop: "0.25rem" }}>
                  {t.date} — ${t.deposit ? `+${t.deposit}` : `-${t.withdrawal}`} | Balance: ${t.balance}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p style={{ fontSize: "1rem", color: "#9CA3AF", marginTop: "1.5rem" }}>
          Click to view transactions
        </p>
      </div>

      {showAuth && (
        <Authentication
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Analytics;
