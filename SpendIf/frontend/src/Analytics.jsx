import React, { useState, useEffect } from "react";
import Authentication from "./Authentication";

const Analytics = ({ data }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const updateLoginState = () => {
  const token = localStorage.getItem("token");
  const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      setRecentTransactions(data.slice(-3).reverse());
    } else {
      setRecentTransactions([]);
      setShowTransactions(false); 
    }
  };

  useEffect(() => {
    updateLoginState();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        updateLoginState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [data]);

  const handleCardClick = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      setShowTransactions((prev) => !prev);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    updateLoginState();
    setShowTransactions(true);
  };

  return (
    <>
      <div
  className="analytics-card"
  onClick={handleCardClick}
  style={{
    background: "#fff",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    cursor: "pointer",
    width: "100%",
    maxWidth: "100%",       
    boxSizing: "border-box", 
    transition: "all 0.2s ease-in-out",
    transform: "scale(1)",
    margin: "0 auto",
  }}
>

        <h2 style={{ marginBottom: "1.5rem", fontSize: "2rem" }}>
          Recent Transactions
        </h2>

        {isLoggedIn ? (
          showTransactions ? (
          recentTransactions.length === 0 ? (
            <p style={{ color: "#000", fontSize: "1.2rem" }}>
                No previous transactions
            </p>
            ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recentTransactions.map((t, index) => (
              <li
                  key={index}
                  style={{
                  borderBottom:
                  index < recentTransactions.length - 1
                  ? "1px solid #eee"
                  : "none",
                  padding: "1rem 0",
                  }}
                  >
            <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>
                {t.description}
                </div>
                <div
                style={{
                    fontSize: "1rem",
                    color: "#000",
                    marginTop: "0.25rem",
                    }}
                    >
                  {t.date} — $
                  {t.deposit ? `+${t.deposit}` : `-${t.withdrawal}`} | Balance: $
                  {t.balance}
                </div>
                </li>
                ))}
              </ul>
            )
          ) : (
          <p style={{ fontSize: "1rem", color: "#9CA3AF", marginTop: "1.5rem" }}>
            Click to view your last 3 uploaded transactions.
          </p>
          )
        ) : (
          <p style={{ fontSize: "1rem", color: "#9CA3AF", marginTop: "1.5rem" }}>
           Click to login and view your last 3 uploaded transactions.
          </p>
        )}
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
