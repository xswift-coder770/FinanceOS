  


 

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import {
  getHabits,
  createHabit,
  toggleHabit as toggleHabitAPI,
  deleteHabit as deleteHabitAPI,
} from "../services/habitService";
import "../styles/HabitTracker.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const BADGE_LEVELS = [
  {
    id: 1, level: 1, name: "Step Taker", icon: "👣",
    desc: "Complete your first habit", req: 1,
    color: "#6B7280", glow: "#9CA3AF", bg: "from-gray-500 to-gray-700",
  },
  {
    id: 2, level: 2, name: "Doer", icon: "⚡",
    desc: "Complete 5 habits total", req: 5,
    color: "#3B82F6", glow: "#60A5FA", bg: "from-blue-500 to-blue-700",
  },
  {
    id: 3, level: 3, name: "Habit Former", icon: "🌱",
    desc: "Maintain a 7-day streak", req: 7,
    color: "#10B981", glow: "#34D399", bg: "from-emerald-500 to-teal-600",
  },
  {
    id: 4, level: 4, name: "Consistent Saver", icon: "💰",
    desc: "Reach discipline score 40", req: 40,
    color: "#F59E0B", glow: "#FCD34D", bg: "from-yellow-400 to-amber-600",
  },
  {
    id: 5, level: 5, name: "Budget Master", icon: "📊",
    desc: "Reach discipline score 55", req: 55,
    color: "#8B5CF6", glow: "#A78BFA", bg: "from-violet-500 to-purple-700",
  },
  {
    id: 6, level: 6, name: "Smart Spender", icon: "🧠",
    desc: "Complete 30 habits total", req: 30,
    color: "#EC4899", glow: "#F472B6", bg: "from-pink-500 to-rose-600",
  },
  {
    id: 7, level: 7, name: "Wealth Builder", icon: "🏗️",
    desc: "Reach discipline score 70", req: 70,
    color: "#F97316", glow: "#FB923C", bg: "from-orange-500 to-red-500",
  },
  {
    id: 8, level: 8, name: "Finance Warrior", icon: "⚔️",
    desc: "Maintain a 30-day streak", req: 30,
    color: "#EF4444", glow: "#F87171", bg: "from-red-500 to-rose-700",
  },
  {
    id: 9, level: 9, name: "Wealth Guardian", icon: "🛡️",
    desc: "Reach discipline score 85", req: 85,
    color: "#06B6D4", glow: "#22D3EE", bg: "from-cyan-500 to-sky-600",
  },
  {
    id: 10, level: 10, name: "Wealth Master", icon: "👑",
    desc: "Reach discipline score 100", req: 100,
    color: "#FFD700", glow: "#FBBF24", bg: "from-yellow-300 via-amber-400 to-orange-500",
  },
];

const INITIAL_HABITS = [
  { id: 1, icon: "💰", title: "Save ₹50 Daily", freq: "Daily", streak: 15, best: 15, done: false, color: "#3B82F6" },
  { id: 2, icon: "📉", title: "Track All Expenses", freq: "Daily", streak: 8, best: 12, done: true, color: "#10B981" },
  { id: 3, icon: "🚫", title: "No Impulse Buying", freq: "Daily", streak: 3, best: 7, done: false, color: "#F59E0B" },
  { id: 4, icon: "📊", title: "Review Budget", freq: "Weekly", streak: 5, best: 5, done: true, color: "#8B5CF6" },
  { id: 5, icon: "🎯", title: "SIP Investment", freq: "Monthly", streak: 2, best: 4, done: false, color: "#EC4899" },
];

const CHALLENGES = [
  { icon: "🥡", text: "No food delivery orders today", points: 15 },
  { icon: "💸", text: "Save ₹100 extra today", points: 20 },
  { icon: "📝", text: "Log every single expense", points: 10 },
  { icon: "☕", text: "Skip that ₹200 café visit", points: 12 },
  { icon: "🛍️", text: "Zero online shopping today", points: 18 },
];

const QUOTES = [
  "Small savings today create financial freedom tomorrow.",
  "Discipline beats motivation. Every. Single. Time.",
  "Your future self will thank you for every ₹ saved today.",
  "The habit of saving is itself an education.",
  "Financial freedom is available to those who learn and work for it.",
  "Don't save what is left after spending; spend what is left after saving.",
];

const STREAK_WARNINGS = [
  { threshold: 1, msg: "You've missed a few days. ₹50/day saves ₹18,250/year — start now!" },
  { threshold: 3, msg: "3-day gap detected! Rebuild your streak today before it hurts your score." },
  { threshold: 5, msg: "Your streak is fading 😟 — Maintain your ₹50 daily saving to get back on track!" },
  { threshold: 7, msg: "A week without consistency — your future self is waiting for you to restart!" },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function CircleProgress({ value, max = 100, size = 80, stroke = 7, color = "#3B82F6", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(59,130,246,0.10)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <foreignObject x={0} y={0} width={size} height={size} style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}>
        <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>
      </foreignObject>
    </svg>
  );
}

function AddHabitModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("💡");
  const [freq, setFreq] = useState("Daily");
  const icons = ["💰", "📉", "🚫", "📊", "🎯", "🏦", "🛒", "☕", "🎁", "🔒", "💳", "📱", "🍕", "🚗", "💊"];

  return (
    <div className="ht-modal-overlay">
      <div className="ht-modal-content">
        <h3 className="ht-modal-title">✨ Add New Habit</h3>
        <p className="ht-modal-subtitle">Build discipline one habit at a time</p>

        <div className="ht-field">
          <label className="ht-field-label">Choose Icon</label>
          <div className="ht-icon-grid">
            {icons.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`ht-icon-btn ${icon === i ? "selected" : ""}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="ht-field">
          <label className="ht-field-label">Habit Name</label>
          <input
            className="ht-text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Save ₹100 today"
          />
        </div>

        <div className="ht-field last">
          <label className="ht-field-label">Frequency</label>
          <div className="ht-freq-row">
            {["Daily", "Weekly", "Monthly"].map((f) => (
              <button
                key={f}
                onClick={() => setFreq(f)}
                className={`ht-freq-btn ${freq === f ? "selected" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="ht-modal-actions">
          <button onClick={onClose} className="ht-modal-cancel">Cancel</button>
          <button
            onClick={() => {
              if (title.trim()) {
                onAdd({ icon, title, freq });
                onClose();
              }
            }}
            className="ht-modal-submit"
          >
            + Add Habit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate(); // now

  const [showAdd, setShowAdd] = useState(false);
  const [disciplineScore, setDisciplineScore] = useState(71);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [activeTab, setActiveTab] = useState("habits");
  const [animScore, setAnimScore] = useState(0);
  const [celebrating, setCelebrating] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const totalDone = habits.filter((h) => h.lastCompletedDate === today).length;

  const bestStreak = habits.length ? Math.max(...habits.map((h) => h.bestStreak)) : 0;
  const currentStreak = habits.length ? Math.max(...habits.map((h) => h.streak)) : 0;

  // streak warning
  const losingStreak = habits.filter((h) => !h.lastCompletedDate === today && h.streak < 3).length >= 2;
  const warning = losingStreak ? STREAK_WARNINGS[Math.min(2, habits.filter((h) => h.streak === 0).length)] : null;

  const generateRealCalendar = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formatted = date.toISOString().split("T")[0];

      let completedCount = 0;
      habits.forEach((habit) => {
        const found = habit.dailyHistory?.find((d) => d.date === formatted && d.completed);
        if (found) completedCount++;
      });

      if (completedCount === habits.length && habits.length > 0) days.push("full");
      else if (completedCount > 0) days.push("partial");
      else days.push("miss");
    }
    return days;
  };

  const calendar = generateRealCalendar();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Animate discipline score on mount
  useEffect(() => {
    let start = 0;
    const step = disciplineScore / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= disciplineScore) {
        setAnimScore(disciplineScore);
        clearInterval(timer);
      } else {
        setAnimScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [disciplineScore]);

  const getLevelInfo = (score) => {
    if (score >= 90) return { level: 5, title: "Finance Warrior", color: "#FFD700" };
    if (score >= 70) return { level: 4, title: "Wealth Builder", color: "#F97316" };
    if (score >= 50) return { level: 3, title: "Budget Master", color: "#8B5CF6" };
    if (score >= 30) return { level: 2, title: "Smart Spender", color: "#3B82F6" };
    return { level: 1, title: "Step Taker", color: "#6B7280" };
  };
  const levelInfo = getLevelInfo(disciplineScore);

  const toggleHabit = async (id) => {
    try {
      const updatedHabit = await toggleHabitAPI(id);
      setHabits((prev) =>
        prev.map((habit) => (habit._id === updatedHabit._id ? updatedHabit : habit))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addHabit = async ({ icon, title, freq }) => {
    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"];

      const newHabit = {
        icon,
        title,
        frequency: freq,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      const createdHabit = await createHabit(newHabit);
      setHabits((prev) => [...prev, createdHabit]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitAPI(id);
      setHabits((prev) => prev.filter((habit) => habit._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const isBadgeUnlocked = (badge) => {
    if (badge.req <= 10) return totalDone >= badge.req;
    return disciplineScore >= badge.req;
  };

  return (
    <>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <div className="ht-page">
        <Navbar />

        <div className="ht-container">
          {/* HEADER */}
          <div className="ht-header">
            <div>
              <h1 className="ht-title">Habit Tracker 🎯</h1>
              <p className="ht-subtitle">Build strong financial habits · May 2026</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="ht-add-btn">
              <span className="ht-add-btn-icon">+</span> Add Habit
            </button>
          </div>

          {/* STREAK WARNING BANNER */}
          {warning && (
            <div className="ht-card ht-warning-banner">
              <span className="ht-warning-icon">⚠️</span>
              <div>
                <p className="ht-warning-title">Streak Alert!</p>
                <p className="ht-warning-msg">{warning.msg}</p>
              </div>
            </div>
          )}

          {/* TOP STATS ROW */}
          <div className="ht-stats-row">
            {/* Discipline Score */}
            <div className="ht-blue-card ht-stat-discipline">
              <CircleProgress value={animScore} max={100} size={72} stroke={7} color={levelInfo.color}>
                <span style={{ fontSize: 13, fontWeight: 800, color: levelInfo.color }}>{animScore}</span>
              </CircleProgress>
              <div>
                <p className="ht-stat-label">Discipline Score</p>
                <p className="ht-stat-value-lg">{animScore}<span>/100</span></p>
                <p className="ht-stat-level" style={{ color: levelInfo.color }}>
                  {levelInfo.title} · Lv.{levelInfo.level}
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="ht-blue-card ht-stat-card">
              <p className="ht-stat-label">Best Streak</p>
              <div className="ht-streak-row">
                <span className="ht-streak-fire">🔥</span>
                <span className="ht-streak-num">{bestStreak}</span>
                <span className="ht-streak-unit">days</span>
              </div>
              <p className="ht-streak-sub">Current: {currentStreak} days active</p>
            </div>

            {/* Today's Progress */}
            <div className="ht-blue-card ht-progress-card">
              <p className="ht-stat-label">Today's Progress</p>
              <div className="ht-progress-row">
                <span className="ht-progress-num">{totalDone}</span>
                <span className="ht-progress-total">/ {habits.length}</span>
              </div>
              <div className="ht-progress-track">
                <div
                  className="ht-progress-fill"
                  style={{ width: `${(totalDone / Math.max(habits.length, 1)) * 100}%` }}
                />
              </div>
              <p className="ht-progress-remaining">{habits.length - totalDone} remaining today</p>
            </div>
          </div>

          {/* TABS */}
          <div className="ht-tabs">
            {[["habits", "🎯 Habits"], ["badges", "🏅 Badges"], ["calendar", "📅 Calendar"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`ht-tab-btn ${activeTab === id ? "active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* HABITS TAB */}
          {activeTab === "habits" && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              {/* Quote */}
              <div className="ht-card ht-quote-card">
                <span className="ht-quote-icon">💡</span>
                <p className="ht-quote-text">"{QUOTES[quoteIdx]}"</p>
              </div>

              <div className="ht-habits-grid">
                {habits.map((h) => {
                  const isDoneToday = h.lastCompletedDate === today;
                  return (
                    <div
                      key={h._id}
                      className={`ht-card ht-habit-card ${celebrating === h._id ? "celebrating" : ""}`}
                      style={{
                        background: isDoneToday
                          ? `linear-gradient(135deg, ${h.color}14 0%, #FFFFFF 100%)`
                          : "#FFFFFF",
                        border: isDoneToday ? `1px solid ${h.color}44` : "1px solid rgba(59,130,246,0.14)",
                      }}
                    >
                      {isDoneToday && (
                        <div
                          className="ht-habit-glow-edge"
                          style={{ background: `linear-gradient(90deg, transparent, ${h.color}, transparent)` }}
                        />
                      )}

                      <div className="ht-habit-top">
                        <div className="ht-habit-left">
                          <div
                            className="ht-habit-icon"
                            style={{
                              background: `linear-gradient(135deg, ${h.color}33, ${h.color}1a)`,
                              border: `1px solid ${h.color}44`,
                            }}
                          >
                            {h.icon}
                          </div>
                          <div>
                            <p className="ht-habit-title" style={{ color: isDoneToday ? "#0F172A" : "#334155" }}>
                              {h.title}
                            </p>
                            <p className="ht-habit-meta">{h.frequency} · 🔥 {h.streak} day streak</p>
                          </div>
                        </div>
                        <button onClick={() => deleteHabit(h._id)} className="ht-habit-delete">×</button>
                      </div>

                      <div className="ht-habit-progress-track">
                        <div
                          className="ht-habit-progress-fill"
                          style={{
                            width: isDoneToday ? "100%" : `${(h.streak / Math.max(h.bestStreak, 1)) * 100}%`,
                            background: `linear-gradient(90deg, ${h.color}, ${h.color}aa)`,
                            boxShadow: isDoneToday ? `0 0 8px ${h.color}66` : "none",
                          }}
                        />
                      </div>

                      <div className="ht-habit-bottom">
                        <span className="ht-habit-best">Best: {h.bestStreak} days</span>
                        <button
                          onClick={() => {
                            if (!isDoneToday) toggleHabit(h._id);
                          }}
                          className={`ht-toggle-btn ${isDoneToday ? "done" : "pending"}`}
                          style={
                            isDoneToday
                              ? {
                                  background: `linear-gradient(135deg, ${h.color}, ${h.color}cc)`,
                                  boxShadow: `0 4px 14px ${h.color}44`,
                                  cursor: "not-allowed",
                                  opacity: 0.85,
                                }
                              : undefined
                          }
                        >
                          {isDoneToday ? "✓ Completed!" : "Mark Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Motivational Insights */}
              <div className="ht-card ht-insights-card">
                <h3 className="ht-insights-title">💬 Smart Insights</h3>
                <div className="ht-insights-grid">
                  {[
                    {
                      icon: "🔥",
                      text: currentStreak > 0 ? `${currentStreak}-day streak maintained!` : "Start your first streak today!",
                      color: "#F59E0B",
                    },
                    {
                      icon: "✅",
                      text:
                        totalDone === habits.length && habits.length > 0
                          ? "All habits completed today!"
                          : `${totalDone} of ${habits.length} habits completed`,
                      color: "#10B981",
                    },
                    {
                      icon: "🏅",
                      text:
                        disciplineScore >= 70
                          ? "Excellent financial discipline!"
                          : disciplineScore >= 40
                          ? "Good consistency this week"
                          : "Keep improving your discipline score",
                      color: "#3B82F6",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="ht-insight-item"
                      style={{ background: `${item.color}11`, border: `1px solid ${item.color}22` }}
                    >
                      <span className="ht-insight-icon">{item.icon}</span>
                      <p className="ht-insight-text" style={{ color: item.color }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BADGES TAB */}
          {activeTab === "badges" && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <div className="ht-badges-intro">
                <p>
                  Unlock badges by building discipline.{" "}
                  <span className="ht-highlight">{BADGE_LEVELS.filter((b) => isBadgeUnlocked(b)).length}</span> of{" "}
                  {BADGE_LEVELS.length} unlocked
                </p>
              </div>
              <div className="ht-badges-grid">
                {BADGE_LEVELS.map((badge) => {
                  const unlocked = isBadgeUnlocked(badge);
                  return (
                    <div
                      key={badge.id}
                      className={`ht-card ht-badge-card ${!unlocked ? "locked" : ""}`}
                      style={{
                        background: unlocked
                          ? `linear-gradient(145deg, ${badge.color}14, #FFFFFF)`
                          : "#FAFBFF",
                        border: unlocked ? `1px solid ${badge.color}44` : "1px solid rgba(59,130,246,0.10)",
                      }}
                    >
                      {unlocked && (
                        <div
                          className="ht-badge-glow-edge"
                          style={{ background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)` }}
                        />
                      )}

                      <div className="ht-badge-icon-wrap">
                        <div
                          className="ht-badge-icon"
                          style={{
                            background: unlocked
                              ? `linear-gradient(135deg, ${badge.color}44, ${badge.color}22)`
                              : "rgba(59,130,246,0.05)",
                            border: unlocked ? `2px solid ${badge.color}66` : "2px solid rgba(59,130,246,0.10)",
                            boxShadow: unlocked ? `0 0 20px ${badge.color}33, 0 0 40px ${badge.color}1a` : "none",
                          }}
                        >
                          {unlocked ? badge.icon : "🔒"}
                        </div>
                        {unlocked && <div className="ht-badge-check">✓</div>}
                      </div>

                      <p className={`ht-badge-name ${!unlocked ? "locked-text" : ""}`}>{badge.name}</p>
                      <p className={`ht-badge-desc ${!unlocked ? "locked-text" : ""}`}>{badge.desc}</p>
                      <div
                        className="ht-badge-level-pill"
                        style={{
                          background: unlocked ? `${badge.color}22` : "rgba(59,130,246,0.05)",
                          border: unlocked ? `1px solid ${badge.color}33` : "1px solid rgba(59,130,246,0.10)",
                        }}
                      >
                        <span style={{ color: unlocked ? badge.color : "#94A3B8" }}>Lv.{badge.level}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === "calendar" && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <div className="ht-card ht-calendar-card">
                <h3 className="ht-calendar-title">Monthly Consistency</h3>
                <p className="ht-calendar-sub">Last 30 days contributions</p>
                <div className="ht-calendar-grid">
                  {calendar.map((day, i) => (
                    <div
                      key={i}
                      title={day === "full" ? "All habits done" : day === "partial" ? "Some habits done" : "Missed"}
                      className={`ht-calendar-day ${day}`}
                    />
                  ))}
                </div>
                <div className="ht-calendar-legend">
                  {[
                    { swatch: "linear-gradient(135deg, #10B981, #059669)", label: "All done" },
                    { swatch: "linear-gradient(135deg, #3B82F6, #1D4ED8)", label: "Partial" },
                    { swatch: "rgba(59,130,246,0.06)", label: "Missed", border: "1px solid rgba(59,130,246,0.14)" },
                  ].map((item, i) => (
                    <div key={i} className="ht-legend-item">
                      <div className="ht-legend-swatch" style={{ background: item.swatch, border: item.border }} />
                      <span className="ht-legend-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Month stats */}
              <div className="ht-month-stats-grid">
                {[
                  { icon: "✅", value: `${calendar.filter((d) => d === "full").length}`, label: "Perfect Days", color: "#10B981" },
                  { icon: "🔵", value: `${calendar.filter((d) => d === "partial").length}`, label: "Partial Days", color: "#3B82F6" },
                  { icon: "❌", value: `${calendar.filter((d) => d === "miss").length}`, label: "Missed Days", color: "#EF4444" },
                ].map((item, i) => (
                  <div key={i} className="ht-blue-card ht-month-stat">
                    <p className="ht-month-stat-icon">{item.icon}</p>
                    <p className="ht-month-stat-value" style={{ color: item.color }}>{item.value}</p>
                    <p className="ht-month-stat-label">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer quote */}
          <div className="ht-footer">
            <p>FinanceOS · Financial Discipline Platform · {new Date().getFullYear()}</p>
          </div>
        </div>

        {showAdd && <AddHabitModal onAdd={addHabit} onClose={() => setShowAdd(false)} />}
      </div>
    </>
  );
}