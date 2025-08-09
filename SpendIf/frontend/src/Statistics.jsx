import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Simple Card component to replace missing import
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-md ${className}`}
    style={{ padding: "1.5rem" }}
  >
    {children}
  </div>
);

const Statistics = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Statistics</h2>
        <p>No data available. Please upload a file first.</p>
      </Card>
    );
  }

  // Total balance
  const totalBalance =
    data.length > 0 ? parseFloat(data[data.length - 1].balance) : 0;

  // Total income (sum of deposits)
  const totalIncome = data.reduce(
    (sum, transaction) => sum + (parseFloat(transaction.deposit) || 0),
    0
  );

  // Total expenses (sum of withdrawals)
  const totalExpenses = data.reduce(
    (sum, transaction) => sum + (parseFloat(transaction.withdrawals) || 0),
    0
  );

  // Category breakdown (simple keyword matching)
  const categorySums = { Food: 0, Entertainment: 0, Other: 0 };
  data.forEach((transaction) => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <p>
          Total Balance: <strong>${totalBalance.toFixed(2)}</strong>
        </p>
        <p>
          Total Income: <strong>${totalIncome.toFixed(2)}</strong>
        </p>
        <p>
          Total Expenses: <strong>${totalExpenses.toFixed(2)}</strong>
        </p>
      </Card>

      {/* Pie Chart */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
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
      </Card>
    </div>
  );
};

export default Statistics;
