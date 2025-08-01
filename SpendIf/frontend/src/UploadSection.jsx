import React from "react";
import { FiUpload } from "react-icons/fi";

const UploadSection = ({ handleFileUpload }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload CSV File</h2>
        <p style={styles.subtitle}>
          Drag and drop your CSV file or click to select.
        </p>
        <label htmlFor="file-upload" style={styles.uploadBox}>
          <div style={styles.uploadIcon}><FiUpload size={32} /></div>
          <p>Drop your CSV file here<br /><small>or click to browse files</small></p>
          <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
        </label>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>CSV Format Guide</h2>
        <p style={styles.subtitle}>Follow this format for successful imports</p>
        <div style={styles.tags}>
          {["date", "merchant", "amount", "category"].map((tag) => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
        <ul style={styles.requirements}>
          <li><b>date:</b> YYYY-MM-DD format</li>
          <li><b>description:</b> Description of transaction</li>
          <li><b>Deposits:</b> Amount</li>
          <li><b>Withdrawals:</b> Amount</li>
          <li><b>Balance:</b> Amount</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    marginBottom: "2rem",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "1200px",   // Added max width to let it fill wider area
    marginLeft: "auto",
    marginRight: "auto",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    flex: "0 0 48%",      // fixed basis to 48% so both are equal width and take most of the container
    minWidth: "300px",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: "1rem",
  },
  uploadBox: {
    border: "3px dashed #3B82F6",
    borderRadius: "0.75rem",
    padding: "2rem",
    textAlign: "center",
    cursor: "pointer",
    color: "#3B82F6",
    boxSizing: "border-box",
    display: "inline-block",
    width: "100%",
  },
  uploadIcon: {
    marginBottom: "0.5rem",
  },
  tags: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#F3F4F6",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.875rem",
  },
  requirements: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    color: "#374151",
    fontSize: "0.95rem",
  },
};

export default UploadSection;
