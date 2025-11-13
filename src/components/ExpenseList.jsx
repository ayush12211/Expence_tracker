import React, { useEffect, useState } from "react";

/**
 * ExpenseList with pagination (3 items per page)
 *
 * Props:
 * - expenses: array of { id, title, price, category, date }
 * - onEdit(updatedExpense)
 * - onDelete(id)
 */

const PER_PAGE = 3;

export default function ExpenseList({ expenses = [], onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });
  const [page, setPage] = useState(1);

  // Keep page in-range when expenses change
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(expenses.length / PER_PAGE));
    if (page > totalPages) setPage(totalPages);
    if (expenses.length === 0) setPage(1);
  }, [expenses.length, page]);

  // Prepare sorted list (newest first)
  const sorted = [...expenses].sort((a, b) => {
    // If date is not a valid date, keep original order via fallback to timestamps or id
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const paged = sorted.slice(start, start + PER_PAGE);

  const openEdit = (exp) => {
    setEditingId(exp.id);
    setForm({
      title: exp.title ?? "",
      price: exp.price ?? "",
      category: exp.category ?? "",
      date: exp.date ?? "",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setForm({ title: "", price: "", category: "", date: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submitEdit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price || !form.category || !form.date) {
      alert("Please fill all fields");
      return;
    }
    const updated = {
      id: editingId,
      title: form.title,
      price: Number(form.price),
      category: form.category,
      date: form.date,
    };
    onEdit(updated);
    closeEdit();
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const setPageNum = (n) => setPage(() => Math.min(Math.max(1, n), totalPages));

  const iconFor = (cat) => {
    if (cat === "Food") return "🍕";
    if (cat === "Travel") return "🧳";
    if (cat === "Entertainment") return "🎟️";
    return "💳";
  };

  if (!expenses || expenses.length === 0) {
    return <div style={{ padding: 18, color: "#777" }}>No transactions!</div>;
  }

  return (
    <div>
      {/* List of transactions (paged) */}
      {paged.map((exp) => (
        <div key={exp.id} className="tx-item">
          <div className="avatar" aria-hidden>
            <div style={{ fontSize: 18 }}>{iconFor(exp.category)}</div>
          </div>

          <div className="tx-meta">
            <div className="tx-title">{exp.title}</div>
            <div className="tx-date">{exp.date}</div>
          </div>

          <div className="tx-amount">₹{exp.price}</div>

          <div className="tx-actions" onClick={(e) => e.stopPropagation()}>
            <div
              className="action-badge del"
              onClick={() => {
                if (confirm("Delete this expense?")) {
                  onDelete(exp.id);
                  // if deleting last item on page, step back if necessary (handled by useEffect)
                }
              }}
              title="Delete"
            >
              ✕
            </div>

            <div
              className="action-badge edit"
              onClick={() => openEdit(exp)}
              title="Edit"
            >
              ✎
            </div>
          </div>
        </div>
      ))}

      {/* Pagination controls (only show if more than 1 page) */}
      <div className="pagination" style={{ marginTop: 12 }}>
        <button
          className="page-btn"
          onClick={goPrev}
          disabled={page <= 1}
          style={{
            opacity: page <= 1 ? 0.45 : 1,
            cursor: page <= 1 ? "default" : "pointer",
          }}
        >
          ←
        </button>

        <button
          className="page-num"
          onClick={() => {
            const next = page === totalPages ? 1 : page + 1;
            setPageNum(next);
          }}
          title={`Page ${page} of ${totalPages}`}
        >
          {page}
        </button>

        <button
          className="page-btn"
          onClick={goNext}
          disabled={page >= totalPages}
          style={{
            opacity: page >= totalPages ? 0.45 : 1,
            cursor: page >= totalPages ? "default" : "pointer",
          }}
        >
          →
        </button>
      </div>

      {/* Edit modal */}
      {editingId && (
        <div className="modal" role="dialog" aria-modal="true">
          <form className="modal-card" onSubmit={submitEdit}>
            <h3>Edit Expenses</h3>

            <div className="modal-row">
              <input
                className="modal-input"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
              />
              <input
                className="modal-input"
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="modal-row">
              <select
                className="modal-input"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>

              <input
                className="modal-input"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="modal-btn-primary">
                Update Expense
              </button>
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={closeEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
