import React, { useState } from "react";
import {
  FiMenu,
  FiUpload,
  FiX,
  FiHome,
  FiTrendingUp,
  FiShield,
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
import UploadSection from "./UploadSection";
import Analytics from "./Analytics";
import Statistics from "./Statistics";  // <-- Import Statistics here

const navItems = [
  { name: "Dashboard", icon: <FiHome /> },
  { name: "Upload", icon: <FiUpload /> },
  { name: "Analytics", icon: <FiTrendingUp /> },
  { name: "Statistics", icon: <FiBarChart2 /> },  // Your new tab
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

// ✅ Sample data to display before upload
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
  const [data, setData] = useState(sampleData); // ✅ Start with sample data
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split("\n");
      const headers = lines[0].toLowerCase();
      if (!headers.includes("date") || !headers.includes("description") || !headers.includes("balance")) {
        alert("Invalid file format.");
        return;
      }

      const parsed = lines.slice(1).map((line) => {
        const [date, description, deposit, withdrawal, balance, category] = line.split(",");
        return {
          date,
          month: new Date(date).toLocaleString("default", { month: "short" }),
          deposit: parseFloat(deposit) || 0,
          withdrawal: parseFloat(withdrawal) || 0,
          balance: parseFloat(balance) || 0,
          category: category?.trim() || "Uncategorized",
        };
      });

      setData(parsed); // ✅ Replace sample with uploaded data
    };
    reader.readAsText(file);
  };

  const latestBalance = data[data.length - 1]?.balance || 0;
  const monthlyIncome = data.reduce((acc, t) => acc + t.deposit, 0);
  const monthlyExpenses = data.reduce((acc, t) => acc + t.withdrawal, 0);

  // ✅ Categorize into Food, Entertainment, and Other
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
          </nav>
          <button onClick={() => setShowNavbar(false)} style={styles.closeButton}>
            <FiX size={24} />
          </button>
        </>
      )}

      <div style={styles.pageContent}>
        <main style={styles.main}>
          <h1>{activeTab}</h1>

          {activeTab === "Upload" && <UploadSection handleFileUpload={handleFileUpload} />}
          {activeTab === "Analytics" && <Analytics data={data} />}
          {activeTab === "Statistics" && <Statistics data={data} />}  {/* <-- Added this */}

          {activeTab === "Dashboard" && (
            <>
              <label style={styles.uploadBtn}>
                <FiUpload /> Upload Transactions
                <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Card title="Total Balance" value={`$${latestBalance.toFixed(2)}`} subtitle={"Latest balance"} color="green" />
                <Card title="Monthly Income" value={`$${monthlyIncome.toFixed(0)}`} subtitle="Total deposits" color="green" />
                <Card title="Monthly Expenses" value={`$${monthlyExpenses.toFixed(0)}`} subtitle="Total withdrawals" color="red" />
                <Card title="Flagged Transactions" value={"0"} subtitle="Requires review" color="orange" />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "400px" }}>
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

                <div style={{ flex: 1, minWidth: "400px" }}>
                  <h3>Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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
    </div>
  );
}

function Card({ title, value, subtitle, color }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "0.5rem",
        flex: 1,
        minWidth: "220px",
        boxShadow: hover
          ? "0 4px 12px rgba(0, 0, 0, 0.1)"
          : "0 1px 2px rgba(0,0,0,0.1)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <p style={{ fontWeight: 600 }}>{title}</p>
      <h2 style={{ color: color === "green" ? "#10B981" : color === "red" ? "#EF4444" : "#F59E0B" }}>{value}</h2>
      <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>{subtitle}</p>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  menuButton: { position: "fixed", top: "1rem", left: "1rem", background: "none", border: "none", cursor: "pointer", zIndex: 1000, color: "black" },
  closeButton: { position: "fixed", top: "1rem", left: "210px", background: "none", border: "none", cursor: "pointer", zIndex: 1000, color: "black" },
  navbar: { backgroundColor: "#ffffff", padding: "1rem 0.5rem", width: "200px", height: "100vh", position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #eee", zIndex: 999 },
  navList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "0.5rem", cursor: "pointer", color: "#4B5563", fontWeight: 500, transition: "background-color 0.2s ease" },
  activeNavItem: { backgroundColor: "#0369A1", color: "#ffffff" },
  hoveredNavItem: { backgroundColor: "#f0f0f0" },
  icon: { fontSize: "1.2rem" },
  pageContent: { marginLeft: "220px", flexGrow: 1, display: "flex", flexDirection: "column" },
  main: { flex: 1, padding: "2rem" },
  footer: { textAlign: "center" },
  uploadBtn: { display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#0284C7", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer", marginBottom: "1.5rem" },
};

export default App;
