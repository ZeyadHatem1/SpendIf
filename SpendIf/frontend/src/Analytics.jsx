// Analytics.jsx
import React from "react";

const Analytics = ({ data }) => {
  const recentTransactions = data.slice(-3).reverse(); // Last 3, most recent first

  const handleCardClick = () => {
    console.log("Previous Transactions:", data);
    // Optional: show a modal or route to detailed view
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        maxWidth: "500px",
      }}
    >
      <h2 style={{ marginBottom: "0.75rem" }}>Recent Transactions</h2>
      {recentTransactions.length === 0 ? (
        <p style={{ color: "#6B7280" }}>No previous transactions</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recentTransactions.map((t, index) => (
            <li
              key={index}
              style={{
                borderBottom: index < recentTransactions.length - 1 ? "1px solid #eee" : "none",
                padding: "0.5rem 0",
              }}
            >
              <div style={{ fontWeight: 600 }}>{t.description}</div>
              <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                {t.date} — ${t.deposit ? `+${t.deposit}` : `-${t.withdrawal}`} | Balance: ${t.balance}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "0.75rem" }}>
        Click to view all transactions
      </p>
    </div>
  );
};

export default Analytics;
