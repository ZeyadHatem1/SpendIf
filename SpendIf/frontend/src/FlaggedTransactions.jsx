import React, { useState, useEffect } from "react";

// Demo transactions
const demoData = [
  { id: 1, date: "2025-01-05", amount: 5000, merchant: "MegaMart", flagged: true, flagReason: "Unusually high purchase" },
  { id: 2, date: "2025-02-12", amount: 300, merchant: "OnlineShop", flagged: true, flagReason: "Multiple small transactions in short period" },
  { id: 3, date: "2025-03-10", amount: 1500, merchant: "ElectroStore", flagged: true, flagReason: "Suspicious merchant" },
];

export default function FlaggedTransactions({ userId, data, onClose }) {
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      // show demo data if no real data uploaded
      setFlagged(demoData);
    } else {
      if (!userId) return;
      // fetch flagged transactions from backend
      fetch(`http://localhost:8080/api/transactions/${userId}`)
        .then((res) => res.json())
        .then((fetchedData) => {
          const flaggedTx = fetchedData.filter((tx) => tx.flagged);
          setFlagged(flaggedTx);
        })
        .catch((err) => {
          console.error("Error fetching flagged transactions:", err);
        });
    }
  }, [userId, data]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Flagged Transactions</h2>

        {flagged.length === 0 ? (
          <p>No flagged transactions.</p>
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Merchant</th>
                  <th style={thStyle}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((tx) => (
                  <tr key={tx.id}>
                    <td style={tdStyle}>{tx.date}</td>
                    <td style={tdStyle}>${tx.amount.toFixed(2)}</td>
                    <td style={tdStyle}>{tx.merchant}</td>
                    <td style={{ ...tdStyle, color: "#F59E0B" }}>{tx.flagReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={onClose} style={styles.closeButton}>
          ✖
        </button>
      </div>
    </div>
  );
}

const thStyle = { textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" };
const tdStyle = { padding: "0.5rem", borderBottom: "1px solid #f0f0f0" };

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "400px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "transparent",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#333",
  },
};
