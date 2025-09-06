import React, { useState, useEffect } from "react";

export default function FlaggedTransactions({ data, onClose, onCountUpdate }) {
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    let flaggedTx = [];

    if (!data || data.length === 0) {
      // Demo data for modal only
      flaggedTx = [
        { id: 1, date: "2025-01-05", amount: 5000, merchant: "MegaMart", flagged: true, flagReason: "Unusually high purchase" },
        { id: 2, date: "2025-02-12", amount: 300, merchant: "OnlineShop", flagged: true, flagReason: "Multiple small transactions in short period" },
        { id: 3, date: "2025-03-10", amount: 1500, merchant: "ElectroStore", flagged: true, flagReason: "Suspicious merchant" },
      ];
      // Only update card count if no real data uploaded
      onCountUpdate && onCountUpdate(flaggedTx.length);
    } else {
      // Apply fraud rules to real data
      flaggedTx = data
        .filter(tx => (tx.withdrawal && tx.withdrawal > 1000) || (tx.deposit && tx.deposit > 2000))
        .map((tx, idx) => ({
          id: idx,
          date: tx.date || "Unknown",
          amount: tx.withdrawal || tx.deposit || 0,
          merchant: tx.category || "Unknown",
          flagged: true,
          flagReason:
            (tx.withdrawal && tx.withdrawal > 1000) ? "High withdrawal" :
            (tx.deposit && tx.deposit > 2000) ? "High deposit" :
            "Suspicious transaction",
        }));

      // Update card count immediately with real data
      onCountUpdate && onCountUpdate(flaggedTx.length);
    }

    setFlagged(flaggedTx);
  }, [data, onCountUpdate]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Flagged Transactions</h2>

        {flagged.length === 0 ? (
          <p>No flagged transactions or wrong file format.</p>
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
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: "2rem", borderRadius: "12px", width: "400px", textAlign: "center", position: "relative", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" },
  closeButton: { position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer", color: "#333" },
};
