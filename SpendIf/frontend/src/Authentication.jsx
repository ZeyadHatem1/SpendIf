import React, { useState } from "react";

export default function Authentication({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate login/signup success
    localStorage.setItem("token", "fake-jwt-token");
    onAuthSuccess();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" placeholder="Email" required style={styles.input} />
          <input type="password" placeholder="Password" required style={styles.input} />
          <button type="submit" style={styles.button}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            style={styles.linkButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <button onClick={onClose} style={styles.closeButton}>
          ✖
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", // blur effect background
    backdropFilter: "blur(4px)",   // ✅ blur the background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    border: "none",
    borderRadius: "8px",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "transparent",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
