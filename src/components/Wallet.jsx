import React, { useState } from "react";

export default function Wallet({ balance, onAddIncome }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return alert("Enter a positive amount");
    onAddIncome(n);
    setAmount("");
    setOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="card-title">Wallet Balance:</div>
          <div
            className="card-balance"
            style={{ color: "var(--accent-green)" }}
          >
            ₹{balance}
          </div>
        </div>

        <div>
          <button
            type="button"
            className="pill income"
            onClick={() => setOpen(true)}
          >
            + Add Income
          </button>
        </div>
      </div>

      {open && (
        <div className="modal" role="dialog" aria-modal="true">
          <form className="modal-card" onSubmit={submit}>
            <h3>Add Balance</h3>

            <div className="modal-row" style={{ alignItems: "center" }}>
              <input
                className="modal-input"
                type="number"
                placeholder="Income Amount"
                name="income"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />

              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="modal-btn-primary">
                  Add Balance
                </button>
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
