import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// HoverCard with hover effect (same as Upload page)
const HoverCard = ({ children }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hover && {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        }),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
};

const Statistics = ({ data }) => {
  // 🔥 changed — define sample fallback data
  const sampleData = [
    {
      date: "2025-07-01",
      description: "Restaurant dinner",
      withdrawals: "45.00",
      deposit: "0",
      balance: "500.00",
    },
    {
      date: "2025-07-05",
      description: "Salary",
      withdrawals: "0",
      deposit: "2000.00",
      balance: "2500.00",
    },
    {
      date: "2025-07-10",
      description: "Movie ticket",
      withdrawals: "15.00",
      deposit: "0",
      balance: "2485.00",
    },
  ];

  // 🔥 changed — choose dataset (uploaded data or sample data)
  const dataset = data && data.length > 0 ? data : sampleData;

  // Total balance
  const totalBalance =
    dataset.length > 0 ? parseFloat(dataset[dataset.length - 1].balance) : 0;

  // Total income (sum of deposits)
  const totalIncome = dataset.reduce(
    (sum, transaction) => sum + (parseFloat(transaction.deposit) || 0),
    0
  );

  // Total expenses (sum of withdrawals)
  const totalExpenses = dataset.reduce(
    (sum, transaction) => sum + (parseFloat(transaction.withdrawals) || 0),
    0
  );

  // Category breakdown (keyword-based)
  const categorySums = { Food: 0, Entertainment: 0, Other: 0 };
  dataset.forEach((transaction) => {
    const desc = transaction.description?.toLowerCase() || "";
    const amount = parseFloat(transaction.withdrawals) || 0;
    if (
      desc.includes("restaurant") ||
      desc.includes("grocery") ||
      desc.includes("food")
    ) {
      categorySums.Food += amount;
    } else if (
      desc.includes("cinema") ||
      desc.includes("movie") ||
      desc.includes("concert")
    ) {
      categorySums.Entertainment += amount;
    } else {
      categorySums.Other += amount;
    }
  });

  const pieData = [
    { name: "Food", value: categorySums.Food },
    { name: "Entertainment", value: categorySums.Entertainment },
    { name: "Other", value: categorySums.Other },
  ];

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3"];

  // Find latest month in dataset
  const lastDate = new Date(dataset[dataset.length - 1].date);
  const monthName = lastDate.toLocaleString("default", { month: "long" });

  return (
    <div style={styles.container}>
      {/* Summary Card */}
      <HoverCard>
        <h2 style={styles.title}>Summary</h2>
        <p style={styles.text}>
          Total Balance:{" "}
          <strong style={{ color: "#000" }}>${totalBalance.toFixed(2)}</strong>
        </p>
        <p style={styles.text}>
          Total Income:{" "}
          <strong style={{ color: "green" }}>${totalIncome.toFixed(2)}</strong>
        </p>
        <p style={styles.text}>
          Total Expenses:{" "}
          <strong style={{ color: "red" }}>${totalExpenses.toFixed(2)}</strong>
        </p>
      </HoverCard>

      {/* Expense Breakdown Card */}
      <HoverCard>
        <h2 style={styles.title}>Expense Breakdown</h2>

        {/* 🔥 changed — dynamic sentences based on dataset (uploaded or sample) */}
        <div style={{ marginBottom: "1rem" }}>
          {pieData.map(
            (cat) =>
              cat.value > 0 && (
                <p key={cat.name} style={styles.text}>
                  You spent{" "}
                  <strong style={{ color: "#000" }}>
                    ${cat.value.toFixed(2)}
                  </strong>{" "}
                  on <strong style={{ color: "#000" }}>{cat.name}</strong> during{" "}
                  <strong style={{ color: "#000" }}>{monthName}</strong>.
                </p>
              )
          )}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="80%"
              cy="80%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </HoverCard>
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
    alignItems: "stretch",
    width: "100%",
    maxWidth: "2200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    flex: "1 1 45%",
    minWidth: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.2s ease-in-out",
    minHeight: "320px",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: "1rem",
  },
  text: {
    color: "#374151",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
    textAlign: "justify",
  },
};

export default Statistics;
