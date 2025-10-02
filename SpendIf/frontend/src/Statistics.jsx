import React, { useState } from "react";

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
// Demo data for display
const Statistics = ({ data }) => {
  const sampleData = [
    {
      date: "2025-07-01",
      description: "Restaurant dinner",
      withdrawal: "45.00",
      deposit: "0",
      balance: "500.00",
    },
    {
      date: "2025-07-05",
      description: "Salary",
      withdrawal: "0",
      deposit: "2000.00",
      balance: "2500.00",
    },
    {
      date: "2025-07-10",
      description: "Movie ticket",
      withdrawal: "15.00",
      deposit: "0",
      balance: "2485.00",
    },
  ];

  const dataset = data && data.length > 0 ? data : sampleData;

  
  const totalBalance =
    dataset.length > 0 ? parseFloat(dataset[dataset.length - 1].balance) : 0;
  const totalIncome = dataset.reduce(
    (sum, t) => sum + (parseFloat(t.deposit) || 0),
    0
  );
  const totalExpenses = dataset.reduce(
    (sum, t) => sum + (parseFloat(t.withdrawal) || 0),
    0
  );

  const categorySums = { Food: 0, Entertainment: 0, Extras: 0 };
  dataset.forEach((t) => {
    const desc = t.description?.toLowerCase() || "";
    const amount = parseFloat(t.withdrawal) || 0;
    if (desc.includes("restaurant") || desc.includes("grocery") || desc.includes("food")) {
      categorySums.Food += amount;
    } else if (desc.includes("cinema") || desc.includes("movie") || desc.includes("concert")) {
      categorySums.Entertainment += amount;
    } else {
      categorySums.Extras += amount;
    }
  });

  const lastDate = dataset.length > 0 ? new Date(dataset[dataset.length - 1].date) : null;
  const monthName = lastDate
    ? lastDate.toLocaleString("default", { month: "long" })
    : "";

  return (
    <div style={styles.container}>
      {}
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

      {}
      <HoverCard>
        <h2 style={styles.title}>Expense Breakdown</h2>

        {dataset.length > 0 ? (
          <div style={{ marginBottom: "1rem" }}>
            {Object.entries(categorySums).map(
              ([cat, value]) =>
                value > 0 && (
            <div key={cat} style={{ marginBottom: "1rem" }}>
            <p style={styles.text}>
                You spent{" "}
            <strong style={{ color: "#000" }}>
                ${value.toFixed(2)}
            </strong>{" "}
                on <strong style={{ color: "#000" }}>{cat}</strong>{" "}
                during <strong style={{ color: "#000" }}>{monthName}</strong>.
            </p>
            <p style={{ ...styles.text, fontStyle: "italic", color: "#6b7280" }}>
                💡 Try reducing your spending on {cat.toLowerCase()} to save more.
            </p>
            </div>
                )
            )}
          </div>
        ) : (
        <p style={{ ...styles.text, textAlign: "center", marginTop: "2rem" }}>
          Upload a file first!
        </p>
        )}
      </HoverCard>
    </div>
  );
};

const styles = {
  container: {
  display: "flex",
  flexDirection: "row", 
  gap: "1rem",
  marginBottom: "2rem",
  justifyContent: "center",
  alignItems: "stretch",
  width: "100%",
  maxWidth: "1800px",
  marginLeft: "auto",
  marginRight: "auto",
  flexWrap: "wrap", 
},

  card: {
  backgroundColor: "#fff",
  borderRadius: "0.5rem",
  padding: "1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  flex: "1 1 300px", 
  minWidth: "280px",  
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", 
  justifyContent: "flex-start", 
  transition: "all 0.2s ease-in-out",
  minHeight: "auto", 
},
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  text: {
    color: "#000",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
    textAlign: "justify",
  },
};

export default Statistics;
