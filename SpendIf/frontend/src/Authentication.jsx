import React, { useState } from "react";


const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function Authentication({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Conditional values based on login/signup
    let username = "";
    let email = "";
    let password = "";

    if (isLogin) {
      email = e.target[0].value.trim();
      password = e.target[1].value.trim();
    } else {
      username = e.target[0].value.trim();
      email = e.target[1].value.trim();
      password = e.target[2].value.trim();
    }

    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const body = isLogin
        ? { email, password }
        : { username, email, password };

      // ✅ Updated fetch URL to use dynamic base
      const response = await fetch(
        `${API_BASE}/api/auth/${isLogin ? "login" : "signup"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Store token (for now using email; replace with JWT later)
      localStorage.setItem("token", data.email);

      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              required
              style={styles.input}
            />
          )}
          <input
            type="text"
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            style={styles.linkButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    color: "#333",
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#1e00ffff",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
