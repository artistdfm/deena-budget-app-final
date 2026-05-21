import React from "react";

export default function App() {
  const [budget, setBudget] = React.useState(() => {
    const saved = localStorage.getItem("budget");
    return saved ? Number(saved) : 2000;
  });

  const [entry, setEntry] = React.useState("");

  const [expensesByMonth, setExpensesByMonth] = React.useState(() => {
    const saved = localStorage.getItem("expensesByMonth");
    return saved ? JSON.parse(saved) : {};
  });

  const getMonthKey = () => {
    return new Date().toISOString().slice(0, 7);
  };

  const [selectedMonth, setSelectedMonth] = React.useState(getMonthKey());

  React.useEffect(() => {
    localStorage.setItem("expensesByMonth", JSON.stringify(expensesByMonth));
  }, [expensesByMonth]);

  React.useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  const expenses = expensesByMonth[selectedMonth] || [];

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const remaining = budget - totalSpent;

  function addExpense() {
    if (!entry.trim()) return;

    const parts = entry.trim().split(" ");

    const amount = parseFloat(parts[parts.length - 1]);

    if (isNaN(amount)) {
      alert("Type something like: coffee 5");
      return;
    }

    const label = parts.slice(0, -1).join(" ") || "expense";

    const newExpense = {
      id: Date.now(),
      label,
      amount,
    };

    setExpensesByMonth((prev) => ({
      ...prev,
      [selectedMonth]: [...(prev[selectedMonth] || []), newExpense],
    }));

    setEntry("");
  }

  function deleteExpense(id) {
    setExpensesByMonth((prev) => ({
      ...prev,
      [selectedMonth]: (prev[selectedMonth] || []).filter((e) => e.id !== id),
    }));
  }

  function resetMonth() {
    const ok = window.confirm("Reset this month only?");

    if (!ok) return;

    setExpensesByMonth((prev) => ({
      ...prev,
      [selectedMonth]: [],
    }));
  }

  const months = Object.keys(expensesByMonth).sort().reverse();

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: 20,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      <h1>Budget Tracker</h1>

      <div style={{ marginBottom: 15 }}>
        <label>Month: </label>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {[getMonthKey(), ...months]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
        </select>
      </div>

      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        style={{
          fontSize: 22,
          width: "100%",
          marginBottom: 20,
        }}
      />

      <h2>Spent: ${totalSpent.toFixed(2)}</h2>

      <h2
        style={{
          color: remaining < 0 ? "red" : "green",
        }}
      >
        Left: ${remaining.toFixed(2)}
      </h2>

      <input
        placeholder="coffee 5"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addExpense()}
        style={{
          width: "100%",
          fontSize: 18,
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      <button
        onClick={addExpense}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 20,
        }}
      >
        Add Expense
      </button>

      <button
        onClick={resetMonth}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10,
          fontSize: 18,
        }}
      >
        Reset This Month
      </button>

      <div style={{ marginTop: 25 }}>
        {expenses.map((e) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ddd",
              padding: "8px 0",
            }}
          >
            <div>
              {e.label}: ${e.amount.toFixed(2)}
            </div>

            <button
              onClick={() => deleteExpense(e.id)}
              style={{
                border: "none",
                background: "transparent",
                color: "red",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
