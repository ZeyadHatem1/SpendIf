import React, { useState, useEffect } from "react";

import {
  FiMenu,
  FiUpload,
  FiX,
  FiHome,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./index.css"; 
import UploadSection from "./UploadSection";
import Analytics from "./Analytics";
import Statistics from "./Statistics";  
import Authentication from "./Authentication";
import FlaggedTransactions from "./FlaggedTransactions";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const navItems = [
  { name: "Dashboard", icon: <FiHome /> },
  { name: "Upload", icon: <FiUpload /> },
  { name: "Analytics", icon: <FiTrendingUp /> },
  { name: "Statistics", icon: <FiBarChart2 /> },  
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const sampleData = [
  { date: "2025-01-05", month: "Jan", deposit: 2000, withdrawal: 500, balance: 1500, category: "Food" },
  { date: "2025-02-10", month: "Feb", deposit: 2500, withdrawal: 800, balance: 3200, category: "Rent" },
  { date: "2025-03-15", month: "Mar", deposit: 1800, withdrawal: 600, balance: 4400, category: "Entertainment" },
  { date: "2025-04-12", month: "Apr", deposit: 2200, withdrawal: 700, balance: 5900, category: "Shopping" },
  { date: "2025-05-20", month: "May", deposit: 2100, withdrawal: 900, balance: 7100, category: "Transport" },
];

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showNavbar, setShowNavbar] = useState(false);
  const [data, setData] = useState(sampleData); 
  const [hoveredItem, setHoveredItem] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"));
  const [showFlagged, setShowFlagged] = useState(false);
  const [uploadedData, setUploadedData] = useState(null); 
  const [flaggedCount, setFlaggedCount] = useState(0);


/*
  useEffect(() => {
    fetch(`${API_BASE}/api/hello`)
      .then((res) => res.text())
      .then((msg) => setBackendMessage(msg))
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);
  */
  const parseCSV = (text) => {
    
    const rows = [];
    const lines = text.split(/\r\n|\n/);
    for (let rawLine of lines) {
      if (rawLine.trim() === "") continue;
      const row = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < rawLine.length; i++) {
        const ch = rawLine[i];
        if (ch === '"') {
          if (inQuotes && rawLine[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          row.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      row.push(cur);
      rows.push(row.map(cell => cell.trim()));
    }
    return rows;
  };

  const normalizeHeader = (h) => {
    if (!h) return "";
    
    return h.replace(/\uFEFF/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
  };

  const parseNumber = (s) => {
    if (s === undefined || s === null) return 0;
    let str = String(s).trim();
    if (str === "") return 0;
   
    let negative = false;
    if (str.includes("(") && str.includes(")")) {
      negative = true;
      str = str.replace(/[()]/g, "");
    }
    
    str = str.replace(/[,₹£€$\s]/g, "");
    
    str = str.replace(/−/g, "-");
    if (str === "-" || str === "—") return 0;
    const n = parseFloat(str);
    if (isNaN(n)) return 0;
    return negative ? -Math.abs(n) : n;
  };

  const parseDateIso = (raw) => {
    if (!raw) return "";
    const s = String(raw).trim();
    
    let d = new Date(s);
    if (!isNaN(d)) {
      
      return d.toISOString().split("T")[0];
    }
   
    const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      let [_, dd, mm, yy] = m;
      if (yy.length === 2) yy = "20" + yy;
      const iso = `${yy.padStart(4, "0")}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      d = new Date(iso);
      if (!isNaN(d)) return iso;
    }
    
    return s;
  };

  const monthShortFrom = (dateOrRaw) => {
    if (!dateOrRaw) return "Unknown";
    const d = new Date(dateOrRaw);
    if (!isNaN(d)) return d.toLocaleString("default", { month: "short" });
    
    const m = String(dateOrRaw).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const monthNum = parseInt(m[2], 10);
      const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return names[(monthNum - 1) % 12] || "Unknown";
    }
    
    const word = String(dateOrRaw).match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\b/i);
    if (word) return word[0].slice(0,3);
    return "Unknown";
  };

  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = parseCSV(text);
      if (!rows || rows.length < 2) {
        alert("Invalid file format.");
        return;
      }

      
      const rawHeaders = rows[0].map(h => h ? String(h).replace(/\uFEFF/g, "").trim() : "");
      const headers = rawHeaders.map(normalizeHeader);

      
      const findHeader = (keywords) => {
        for (let i = 0; i < headers.length; i++) {
          const h = headers[i];
          for (const kw of keywords) {
            if (h.includes(kw)) return i;
          }
        }
        return -1;
      };

      
      let dateIdx =
        
        headers.findIndex(h => (h.includes("date") && !h.includes("value") && !h.includes("valuedate"))) ;
      if (dateIdx === -1) dateIdx = findHeader(["value date", "value", "posting date", "transaction date", "value"]);
      
      let depositIdx = findHeader(["deposit", "credit", "credit amt", "deposit amt", "credit amount", "creditamount"]);
      
      let withdrawalIdx = findHeader(["withdrawal", "withdraw", "debit", "withdrawal amt", "debit amt", "withdraw amt"]);
      
      let balanceIdx = findHeader(["balance", "balance amt", "balanceamount"]);
      
      let descIdx = findHeader(["transaction", "description", "details", "narration", "particulars", "remarks"]);

      
      const amountLikeIdx = depositIdx === -1 && withdrawalIdx === -1 ? findHeader(["amount", "amt", "value"]) : -1;

      
      if (dateIdx === -1) dateIdx = 0;

      
      const looksLikeOldFormat =
        headers.includes("date") && (headers.includes("description") || headers.includes("transaction details")) && headers.includes("balance");

      
      const parsed = rows.slice(1).map((cols) => {
  const get = (i) => (i >= 0 && i < cols.length ? cols[i] : "");

  const rawDate = get(dateIdx);
  const dateIso = parseDateIso(rawDate);
  const month = monthShortFrom(dateIso || rawDate);

  let deposit = 0;
  let withdrawal = 0;

  if (depositIdx !== -1) deposit = parseNumber(get(depositIdx));
  if (withdrawalIdx !== -1) withdrawal = parseNumber(get(withdrawalIdx));

  if ((deposit === 0 && withdrawal === 0) && amountLikeIdx !== -1) {
    const amt = parseNumber(get(amountLikeIdx));
    if (amt < 0) {
      withdrawal = Math.abs(amt);
    } else {
      deposit = amt;
    }
  }

  if (deposit === 0 && withdrawal === 0 && looksLikeOldFormat) {
    const maybeDeposit = parseNumber(get(2));
    const maybeWithdrawal = parseNumber(get(3));
    if (maybeDeposit !== 0 || maybeWithdrawal !== 0) {
      deposit = maybeDeposit;
      withdrawal = maybeWithdrawal;
    }
  }

  const balance = balanceIdx !== -1 ? parseNumber(get(balanceIdx)) : parseNumber(get(cols.length - 1)); 
  const category = descIdx !== -1 ? get(descIdx) : (looksLikeOldFormat ? get(5) : "Uncategorized");

  // Fraud rules 
  let flagged = false;
  let flagReason = "";

  if (deposit > 3000) {
    flagged = true;
    flagReason = "Unusually high deposit";
  } else if (withdrawal > 2000) {
    flagged = true;
    flagReason = "Unusually high withdrawal";
  } else if (category?.toLowerCase().includes("entertainment") && withdrawal > 1000) {
    flagged = true;
    flagReason = "Suspicious entertainment spend";
  } else if (category?.toLowerCase().includes("food") && withdrawal > 1000) {
    flagged = true;
    flagReason = "Suspicious food expense";
  }

  return {
    date: dateIso || String(rawDate).trim(),
    month,
    deposit: deposit || 0,
    withdrawal: withdrawal || 0,
    balance: balance || 0,
    category: category ? String(category).trim() : "Uncategorized",
    flagged,
    flagReason,
  };
}).filter(r => r.date || r.balance || r.deposit || r.withdrawal);
 

      if (!parsed || parsed.length === 0) {
        alert("Invalid file format.");
        return;
      }
      setData(parsed);
      setUploadedData(parsed);
      const flaggedTx = parsed.filter(tx => tx.flagged);
      setFlaggedCount(flaggedTx.length);
    };
    reader.readAsText(file);
  };

  const latestBalance = data[data.length - 1]?.balance || 0;
  const monthlyIncome = data.reduce((acc, t) => acc + t.deposit, 0);
  const monthlyExpenses = data.reduce((acc, t) => acc + t.withdrawal, 0);

  const categoryTotals = { Food: 0, Entertainment: 0, Other: 0 };
  data.forEach(({ category, withdrawal }) => {
    if (!withdrawal) return;
    const cat = category?.toLowerCase();
    if (cat?.includes("food") || cat?.includes("grocer")) {
      categoryTotals.Food += withdrawal;
    } else if (cat?.includes("entertain") || cat?.includes("movie") || cat?.includes("game")) {
      categoryTotals.Entertainment += withdrawal;
    } else {
      categoryTotals.Other += withdrawal;
    }
  });
  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .filter(c => c.value > 0);

  const spendingTrend = Object.values(
    data.reduce((acc, t) => {
      if (!acc[t.month]) acc[t.month] = { month: t.month, income: 0, expenses: 0 };
      acc[t.month].income += t.deposit;
      acc[t.month].expenses += t.withdrawal;
      return acc;
    }, {})
  ).sort((a, b) => new Date(`2025-${a.month}-01`) - new Date(`2025-${b.month}-01`));

  return (
    <div style={styles.wrapper}>
      {!showNavbar && (
        <button onClick={() => setShowNavbar(true)} style={styles.menuButton}>
          <FiMenu size={24} />
        </button>
      )}

      {showNavbar && (
        <>
          <nav style={styles.navbar}>
            <ul style={styles.navList}>
              {navItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setShowNavbar(false);
                  }}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    ...styles.navItem,
                    ...(activeTab === item.name ? styles.activeNavItem : {}),
                    ...(hoveredItem === item.name && activeTab !== item.name && styles.hoveredNavItem),
                  }}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "auto", padding: "1rem" }}>
  {isAuthenticated ? (
    <button
      onClick={() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }}
      style={{
        width: "100%",
        background: "#DC2626",
        color: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => setShowAuth(true)}
      style={{
        width: "100%",
        background: "#2563EB",
        color: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
      }}
    >
      Login / Sign Up
    </button>
  )}
</div>

          </nav>
          <button onClick={() => setShowNavbar(false)} style={styles.closeButton}>
            <FiX size={24} />
          </button>
        </>
      )}

      <div className="page-content" style={styles.pageContent}>
        <main style={styles.main}>
          <h1>{activeTab}</h1>

          {activeTab === "Upload" && <UploadSection handleFileUpload={handleFileUpload} />}
          {activeTab === "Analytics" && <Analytics data={data} />}
          {activeTab === "Statistics" && <Statistics data={data} />}  

          {activeTab === "Dashboard" && (
            <>
              <label style={styles.uploadBtn}>
                <FiUpload /> Upload Transactions
                <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>

              <div
  style={{
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "space-between", 
  }}
>
  <Card
    title="Total Balance"
    value={`$${latestBalance.toFixed(2)}`}
    subtitle={"Latest balance"}
    color="green"
    style={{ flex: "1 1 100%", maxWidth: "100%" }} 
  />
  <Card
    title="Monthly Income"
    value={`$${monthlyIncome.toFixed(0)}`}
    subtitle="Total deposits"
    color="green"
    style={{ flex: "1 1 100%", maxWidth: "100%" }}
  />
  <Card
    title="Monthly Expenses"
    value={`$${monthlyExpenses.toFixed(0)}`}
    subtitle="Total withdrawals"
    color="red"
    style={{ flex: "1 1 100%", maxWidth: "100%" }}
  />
  <Card
    title="Flagged Transactions"
    value={uploadedData ? flaggedCount : 3}
    subtitle={
      uploadedData && flaggedCount === 0
        ? "No flagged transactions / wrong file"
        : "Requires review"
    }
    color="orange"
    onClick={() => setShowFlagged(true)}
    style={{ flex: "1 1 100%", maxWidth: "100%" }}
  />
</div>



              <div
  style={{
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    flexWrap: "wrap",
  }}
>
  <div style={{ flex: "1 1 100%", minWidth: "280px" }}> {}
    <h3>Monthly Spending Trend</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={spendingTrend}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#income)" />
        <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#expenses)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>

  <div style={{ flex: "1 1 100%", minWidth: "280px" }}> {}
    <h3>Spending by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

            </>
          )}
        </main>

        <footer style={styles.footer}>
          <p>&copy; 2025 SpendIf.</p>
        </footer>
      </div>
       {showAuth && (
        <Authentication
        onClose={() => setShowAuth(false)}
        onAuthSuccess={() => {
        setIsAuthenticated(true);
        setShowAuth(false);
            }}
      />
      )}
       {showFlagged && (
        <FlaggedTransactions
        data={uploadedData}
        onClose={() => setShowFlagged(false)}
        onCountUpdate={setFlaggedCount}
      />
      )}

    </div>
  );
}

function Card({ title, value, subtitle, color, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick} 
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "0.5rem",
        flex: 1,
        minWidth: "280px",
        boxShadow: hover
          ? "0 4px 12px rgba(0, 0, 0, 0.1)"
          : "0 1px 2px rgba(0,0,0,0.1)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all 0.2s ease-in-out",
        cursor: onClick ? "pointer" : "default", 
      }}
    >
      <p style={{ fontWeight: 600 }}>{title}</p>
      <h2 style={{ color: color === "green" ? "#10B981" : color === "red" ? "#EF4444" : "#F59E0B" }}>{value}</h2>
      <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>{subtitle}</p>
    </div>
  );
}


const styles = {
  wrapper: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", position:"relative" },
  menuButton: { position: "fixed", top: "1rem", left: "1rem", background: "none", border: "none", cursor: "pointer", zIndex: 1000, color: "black" },
  closeButton: { position: "fixed", top: "1rem", left: "210px", background: "none", border: "none", cursor: "pointer", zIndex: 1000, color: "black" },
  navbar: {backgroundColor: "#e5e7eb", padding: "1rem 0.5rem", width: "200px", height: "100vh", position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #ddd", zIndex: 999,},  navList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "0.5rem", cursor: "pointer", color: "#4B5563", fontWeight: 500, transition: "background-color 0.2s ease" },
  activeNavItem: { backgroundColor: "#0369A1", color: "#ffffff" },
  hoveredNavItem: { backgroundColor: "#f0f0f0" },
  icon: { fontSize: "1.2rem" },
  pageContent: { flexGrow: 1, display: "flex", flexDirection: "column", width: "100%", paddingLeft:"0"},  main: { flex: 1, padding: "2rem" },
  footer: { textAlign: "center" },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#0284C7", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer", marginBottom: "1.5rem" },
};

export default App;
