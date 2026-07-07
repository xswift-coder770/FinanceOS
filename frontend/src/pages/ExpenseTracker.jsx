 

 

import { useState, useEffect } from "react";

import "../styles/pageStyles.css";
import "../styles/ExpenseTracker.css";
import Navbar from "../components/common/Navbar";

import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../services/expenseServices";

const categoryIcons = {
  Food: "🍽️",
  Bills: "🧾",
  Transport: "🚗",
  Shopping: "🛍️",
  Health: "💊",
  Entertainment: "🎬",
  Salary: "💰",
  Freelance: "🧑‍💻",
  Investment: "📈",
  Other: "💳",
};

const categoryColors = {
  Food: "linear-gradient(135deg,#1a3a6b,#2563eb)",
  Bills: "linear-gradient(135deg,#1e3a5f,#1d6fa0)",
  Transport: "linear-gradient(135deg,#0d3b72,#1a73e8)",
  Shopping: "linear-gradient(135deg,#1a4480,#3b82f6)",
  Health: "linear-gradient(135deg,#1e4d94,#60a5fa)",
  Entertainment: "linear-gradient(135deg,#1a3a6b,#1d6fa0)",
  Salary: "linear-gradient(135deg,#047857,#10b981)",
  Freelance: "linear-gradient(135deg,#0f766e,#14b8a6)",
  Investment: "linear-gradient(135deg,#15803d,#22c55e)",
  Other: "linear-gradient(135deg,#0a1628,#1a3a6b)",
};

const CATEGORIES = [
  "Food",
  "Bills",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    type: "expense",
  });

  // FETCH DATA
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD TRANSACTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        ...formData,
      };

      if (formData.type === "income") {
        payload = {
          ...payload,
          title: formData.category,
        };
      }

      const data = await addExpense(payload);

      setExpenses([data, ...expenses]);

      setFormData({
        title: "",
        category: "",
        amount: "",
        date: "",
        type: "expense",
      });

      setSuccessMsg(
        formData.type === "income" ? "Income added!" : "Expense added!"
      );

      setTimeout(() => {
        setSuccessMsg("");
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filtered =
    filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  // TOTALS
  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <>
      <Navbar />

      <div className="et-page">
        <div className="et-container">
          <div className="et-header">
            <div>
              <h1>Transactions</h1>
              <p>Track income & expenses dynamically</p>
            </div>

            <div className="et-badge">📊 {expenses.length} Transactions</div>
          </div>

          {/* SUMMARY */}
          <div className="et-summary-bar">
            <div className="summary-card">
              <span className="summary-icon">💸</span>
              <div>
                <div className="summary-val">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </div>
                <div className="summary-lbl">Total Expense</div>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">💰</span>
              <div>
                <div className="summary-val">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </div>
                <div className="summary-lbl">Total Income</div>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">🏦</span>
              <div>
                <div className="summary-val">
                  ₹{totalBalance.toLocaleString("en-IN")}
                </div>
                <div className="summary-lbl">Net Balance</div>
              </div>
            </div>
          </div>

          <div className="et-main">
            {/* FORM */}
            <div className="form-card">
              <h2>
                {formData.type === "income" ? "💰 Add Income" : "➕ Add Expense"}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* TYPE */}
                <div className="form-field">
                  <label className="form-label">Transaction Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                  </select>
                </div>

                {/* EXPENSE FORM */}
                {formData.type === "expense" ? (
                  <>
                    {/* TITLE */}
                    <div className="form-field">
                      <label className="form-label">Expense Title</label>
                      <input
                        className="form-input"
                        type="text"
                        name="title"
                        placeholder="Enter expense title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* CATEGORY */}
                    <div className="form-field">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.filter(
                          (c) => !["Salary", "Freelance", "Investment"].includes(c)
                        ).map((c) => (
                          <option key={c} value={c}>
                            {categoryIcons[c]} {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* INCOME SOURCE */}
                    <div className="form-field">
                      <label className="form-label">Income Source</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select income source</option>
                        <option value="Salary">💰 Salary</option>
                        <option value="Freelance">🧑‍💻 Freelance</option>
                        <option value="Investment">📈 Investment</option>
                        <option value="Other">💳 Other</option>
                      </select>
                    </div>
                  </>
                )}

                {/* AMOUNT */}
                <div className="form-field">
                  <label className="form-label">Amount</label>
                  <input
                    className="form-input"
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DATE */}
                <div className="form-field">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* BUTTON */}
                <button className="submit-btn" type="submit">
                  {formData.type === "income" ? "Add Income" : "Add Expense"}
                </button>

                {/* SUCCESS */}
                {successMsg && <div className="success-msg">✅ {successMsg}</div>}
              </form>
            </div>

            {/* LIST */}
            <div className="list-card">
              <div className="list-card-header">
                <h2>Recent Transactions</h2>

                <div className="filter-tabs">
                  {["All", ...CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      className={`filter-tab ${filter === cat ? "active" : ""}`}
                      onClick={() => setFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="expense-list">
                {loading ? (
                  <div className="empty-state">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">No transactions found.</div>
                ) : (
                  filtered.map((expense) => (
                    <div className="expense-item" key={expense._id}>
                      <div
                        className="exp-icon-wrap"
                        style={{
                          background:
                            categoryColors[expense.category] ||
                            categoryColors.Other,
                        }}
                      >
                        {categoryIcons[expense.category] || "💳"}
                      </div>

                      <div className="exp-meta">
                        <div className="exp-title">{expense.title}</div>
                        <div className="exp-cat">
                          {expense.category}
                          {" • "}
                          <span
                            style={{
                              color:
                                expense.type === "income" ? "#10b981" : "#ef4444",
                              fontWeight: 600,
                            }}
                          >
                            {expense.type}
                          </span>
                        </div>
                      </div>

                      <div className="exp-right">
                        <div
                          className="exp-amount"
                          style={{
                            color:
                              expense.type === "income" ? "#10b981" : "#ef4444",
                          }}
                        >
                          {expense.type === "income" ? "+₹" : "-₹"}
                          {Number(expense.amount).toLocaleString("en-IN")}
                        </div>
                        <div className="exp-date">{expense.date?.slice(0, 10)}</div>
                      </div>

                      <button
                        className="exp-delete"
                        onClick={() => handleDelete(expense._id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}