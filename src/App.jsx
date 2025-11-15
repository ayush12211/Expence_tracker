import React, { useEffect, useState } from "react";
import Wallet from "./components/Wallet";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Charts from "./components/Charts";
import { loadFromStorage, saveToStorage } from "./utils/Storage";


const STORAGE_KEYS = {
  BALANCE: "walletBalance",
  EXPENSES: "expenses",
};

export default function App() {
  const [balance, setBalance] = useState(() => {
    const b = loadFromStorage(STORAGE_KEYS.BALANCE);
    return b !== null ? Number(b) : 5000;
  });

  const [expenses, setExpenses] = useState(() => {
    const e = loadFromStorage(STORAGE_KEYS.EXPENSES);
    return e ? e : [];
  });

  useEffect(() => saveToStorage(STORAGE_KEYS.BALANCE, balance), [balance]);
  useEffect(() => saveToStorage(STORAGE_KEYS.EXPENSES, expenses), [expenses]);

  // Add income
  const handleAddIncome = (amount) => {
    if (!amount || Number(amount) <= 0) return;
    setBalance((prev) => Number(prev) + Number(amount));
  };

  // Add expense
  const handleAddExpense = (expense) => {
    const price = Number(expense.price);
    if (price > balance) {
      alert("Cannot add expense — exceeds wallet balance");
      return false;
    }
    setExpenses((prev) => [expense, ...prev]);
    setBalance((prev) => Number(prev) - price);
    return true;
  };

  // Edit expense (update expense; adjust balance)
  const handleEditExpense = (updated) => {
    setExpenses((prev) => {
      const old = prev.find((e) => e.id === updated.id);
      if (!old) return prev;
      const newList = prev.map((e) => (e.id === updated.id ? updated : e));
      setBalance(
        (prevBalance) =>
          Number(prevBalance) + Number(old.price) - Number(updated.price)
      );
      return newList;
    });
  };

  // Delete expense (refund to wallet)
  const handleDeleteExpense = (id) => {
    setExpenses((prev) => {
      const toDelete = prev.find((e) => e.id === id);
      if (!toDelete) return prev;
      setBalance((prevBalance) => Number(prevBalance) + Number(toDelete.price));
      return prev.filter((e) => e.id !== id);
    });
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.price), 0);

  return (
    <div className="app-root">
      <h1>Expense Tracker</h1>

      <div className="top-panel">
        <div className="inner-card">
          <Wallet balance={balance} onAddIncome={handleAddIncome} />
        </div>

        <div className="inner-card">
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }} className="card-title">
                Expenses:{" "}
                <span
                  className="card-balance"
                  style={{ color: "var(--accent-yellow)" }}
                >
                  ₹{totalExpenses}
                </span>
              </h3>
            </div>
            <div style={{ marginTop: 18 }}>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>
          </div>
        </div>

        <div className="chart-card">
          <Charts expenses={expenses} />
        </div>
      </div>

      <section className="history">
        <div className="recent-section">
          <h2
            style={{
              margin: "0 0 12px 4px",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            Recent Transactions
          </h2>
          <div className="recent-card">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>

        <div>
          <h2
            style={{
              margin: "0 0 12px 4px",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            Top Expenses
          </h2>
          <div className="top-expenses-card">
            <Charts expenses={expenses} small />
          </div>
        </div>
      </section>
    </div>
  );
}
