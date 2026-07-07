 


// after integration of the backend

import Navbar from "../components/common/Navbar";

import { useState, useEffect } from "react";
import {
  getGoals,
  createGoal,
  addMoneyToGoal,
  deleteGoal as deleteGoalAPI,
} from "../services/goalServices";

import "../styles/pageStyles.css";
import "../styles/SavingsGoals.css";

const GOAL_ICONS = ["🏠", "✈️", "🎓", "🚗", "💍", "🏋️", "💻", "🏦"];
const GOAL_GRADIENTS = [
  "linear-gradient(135deg,#1a3a6b,#2563eb)",
  "linear-gradient(135deg,#1e3a5f,#1d6fa0)",
  "linear-gradient(135deg,#0d3b72,#1a73e8)",
  "linear-gradient(135deg,#1a4480,#3b82f6)",
];

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [depositModal, setDepositModal] = useState(null);
  const [depositAmt, setDepositAmt] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", icon: "🏦", saved: "", target: "", deadline: "" });

  // ye add kiye hai dynamic ke liye
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();

    try {
      const createdGoal = await createGoal({
        ...newGoal,
        saved: Number(newGoal.saved),
        target: Number(newGoal.target),
      });

      setGoals([...goals, createdGoal]);

      setNewGoal({
        title: "",
        icon: "🏦",
        saved: "",
        target: "",
        deadline: "",
      });

      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmt || isNaN(depositAmt)) return;

    try {
      const updatedGoal = await addMoneyToGoal(depositModal._id, depositAmt);

      setGoals(
        goals.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );

      setDepositModal(null);
      setDepositAmt("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await deleteGoalAPI(id);
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const completedGoals = goals.filter((g) => g.saved >= g.target).length;

  return (
    <>
      <Navbar />
      <div className="sg-container">
        <div className="sg-header">
          <div>
            <h1>Savings Goals</h1>
            <p>Track your financial goals and achievements · May 2026</p>
          </div>
          <button className="add-goal-btn" onClick={() => setShowForm(true)}>🎯 Add Goal</button>
        </div>

        {/* Overview Banner */}
        <div className="sg-overview">
          <div className="overview-left">
            <h2>Total Progress</h2>
            <div className="big-val">₹{totalSaved.toLocaleString("en-IN")}</div>
            <div className="overview-track">
              <div className="overview-fill" style={{ width: `${totalTarget ? (totalSaved / totalTarget) * 100 : 0}%` }} />
            </div>
            <span>of ₹{totalTarget.toLocaleString("en-IN")} total target</span>
          </div>
          <div className="overview-right">
            <div className="ov-metric">
              <div className="ov-metric-val">{goals.length}</div>
              <div className="ov-metric-lbl">Active Goals</div>
            </div>
            <div className="ov-divider" />
            <div className="ov-metric">
              <div className="ov-metric-val">{completedGoals}</div>
              <div className="ov-metric-lbl">Completed</div>
            </div>
            <div className="ov-divider" />
            <div className="ov-metric">
              <div className="ov-metric-val">{totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0}%</div>
              <div className="ov-metric-lbl">Overall</div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="goals-grid">
          {goals.map((goal, idx) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            const isComplete = pct >= 100;
            const gradient = GOAL_GRADIENTS[idx % GOAL_GRADIENTS.length];
            return (
              <div key={goal._id} className={`goal-card ${isComplete ? "goal-complete" : ""}`}>
                <div className="goal-card-banner" style={{ background: gradient }} />
                <div className="goal-card-body">
                  <div className="goal-card-top">
                    <div className="goal-icon-wrap" style={{ background: gradient }}>
                      <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.3))" }}>{goal.icon}</span>
                    </div>
                    <div className="goal-info">
                      <div className="goal-title">{goal.title}</div>
                      <div className="goal-deadline">🗓️ By {goal.deadline}</div>
                    </div>
                    <button className="goal-delete-btn" onClick={() => deleteGoal(goal._id)}>✕</button>
                  </div>
                  <div className="goal-amounts">
                    <div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 2 }}>Saved</div>
                      <div className="saved-val">₹{goal.saved.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="target-val">
                      <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 2 }}>Target</div>
                      ₹{goal.target.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="goal-progress-track">
                    <div className="goal-progress-fill" style={{ width: `${Math.min(100, pct)}%`, background: gradient }} />
                  </div>
                  <div className="goal-pct-row">
                    <span className="goal-pct">{Math.min(100, pct)}% Completed</span>
                    {isComplete && <span className="goal-complete-badge">✅ Reached!</span>}
                  </div>
                  <button
                    className="deposit-btn"
                    onClick={() => { setDepositModal(goal); setDepositAmt(""); }}
                    disabled={isComplete}
                  >
                    {isComplete ? "🎉 Goal Achieved!" : "➕ Add Money"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModal && (
        <div className="modal-overlay" onClick={() => setDepositModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>💰 Add to {depositModal.title}</h2>
            <p>Current: ₹{depositModal.saved.toLocaleString("en-IN")} / ₹{depositModal.target.toLocaleString("en-IN")}</p>
            <div className="form-field">
              <label className="form-label">Amount to Add (₹)</label>
              <input className="form-input" type="number" placeholder="Enter amount" min="1" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)} autoFocus />
            </div>
            <div className="form-btns">
              <button className="cancel-btn" onClick={() => setDepositModal(null)}>Cancel</button>
              <button className="submit-btn" onClick={handleDeposit}>Add Money</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>🎯 New Savings Goal</h2>
            <p>Set a target and start saving towards it</p>
            <form onSubmit={addGoal}>
              <div className="form-field">
                <label className="form-label">Goal Title</label>
                <input className="form-input" type="text" placeholder="e.g. Emergency Fund" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} required />
              </div>
              <div className="form-field">
                <label className="form-label">Pick Icon</label>
                <div className="icon-picker">
                  {GOAL_ICONS.map((icon) => (
                    <button type="button" key={icon} className={`icon-opt ${newGoal.icon === icon ? "selected" : ""}`} onClick={() => setNewGoal({ ...newGoal, icon })}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Already Saved (₹)</label>
                <input className="form-input" type="number" placeholder="0" min="0" value={newGoal.saved} onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })} required />
              </div>
              <div className="form-field">
                <label className="form-label">Target Amount (₹)</label>
                <input className="form-input" type="number" placeholder="100000" min="1" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} required />
              </div>
              <div className="form-field">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} required />
              </div>
              <div className="form-btns">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}