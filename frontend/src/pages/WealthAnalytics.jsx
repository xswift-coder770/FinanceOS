  
 

import Navbar from "../components/common/Navbar";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getAnalytics } from "../services/analyticsServices";
import "../styles/Analytics.css";

 
const theme = {
  border: "#E5E7EB",
  textMuted: "#9CA3AF",
  accent: {
    blue: "#3B82F6",
    green: "#10B981",
    red: "#EF4444",
    yellow: "#F59E0B",
    purple: "#8B5CF6",
    cyan: "#06B6D4",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString()}`;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <p className="an-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="an-tooltip-row">
          <div className="an-tooltip-dot" style={{ background: p.color }} />
          <span className="an-tooltip-name">{p.name}:</span>
          <span className="an-tooltip-value">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="an-card an-skeleton-card">
    {[80, 120, 60, 180].map((w, i) => (
      <div key={i} className="an-skeleton-line" style={{ width: `${w}%`, maxWidth: "100%" }} />
    ))}
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    savingsRate: 0,
    monthlyData: [],
    categorySpend: [],
    goalsProgress: [],
    habitPerformance: [],
    insights: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="an-page">
      <Navbar />

      <div className="an-container">
        {/* HEADER */}
        <div className="an-header">
          <div>
            <h1 className="an-title">Analytics</h1>
            <p className="an-subtitle">Deep insights into your financial health</p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className={`an-refresh-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="an-error-banner">⚠️ {error}</div>
        )}

        {/* INSIGHTS BANNER */}
        {!loading && analytics.insights.length > 0 && (
          <div className="an-insights-banner">
            {analytics.insights.map((insight, i) => (
              <div key={i} className="an-insight-chip">{insight}</div>
            ))}
          </div>
        )}

        {/* KPI ROW */}
        <div className="an-kpi-grid">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            [
              { label: "TOTAL INCOME", value: fmt(analytics.totalIncome), badge: "This Period", badgeColor: theme.accent.blue, top: theme.accent.blue },
              { label: "TOTAL EXPENSES", value: fmt(analytics.totalExpense), badge: "This Period", badgeColor: theme.accent.red, top: theme.accent.red },
              { label: "NET SAVINGS", value: fmt(analytics.netSavings), badge: "This Period", badgeColor: theme.accent.green, top: theme.accent.green },
              { label: "SAVINGS RATE", value: `${analytics.savingsRate}%`, badge: "Overall", badgeColor: theme.accent.green, top: theme.accent.cyan },
            ].map((kpi, i) => (
              <div key={i} className="an-card an-kpi-card" style={{ borderTopColor: kpi.top }}>
                <div className="an-kpi-label">{kpi.label}</div>
                <div className="an-kpi-value">{kpi.value}</div>
                <div className="an-kpi-badge" style={{ background: `${kpi.badgeColor}15`, color: kpi.badgeColor }}>
                  {kpi.badge}
                </div>
              </div>
            ))
          )}
        </div>

        {/* TRENDS ROW */}
        <h3 className="an-section-title">Income & Spending Trends</h3>

        <div className="an-trends-grid">
          <div className="an-card">
            <div className="an-chart-header">
              <h2 className="an-chart-title">Income vs Expenses vs Savings</h2>
              <div className="an-live-badge">Live Data</div>
            </div>
            {loading ? (
              <div className="an-loading-text" style={{ height: 280 }}>Loading chart...</div>
            ) : analytics.monthlyData.length === 0 ? (
              <div className="an-empty-state" style={{ height: 280 }}>
                <span className="an-empty-icon">📊</span>
                <span>No monthly data yet</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.monthlyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.textMuted, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.textMuted, fontSize: 12 }} tickFormatter={(v) => v / 1000 + "k"} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.accent.blue, opacity: 0.06 }} />
                  <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }} />
                  <Bar dataKey="income" name="Income" fill={theme.accent.blue} radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="expense" name="Expense" fill={theme.accent.red} radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="savings" name="Savings" fill={theme.accent.green} radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="an-card">
            <div className="an-chart-header">
              <h2 className="an-chart-title">Expense<br />Breakdown</h2>
              <div className="an-live-badge">Live Data</div>
            </div>
            {loading ? (
              <div className="an-loading-text" style={{ height: 220 }}>Loading chart...</div>
            ) : analytics.categorySpend.length === 0 ? (
              <div className="an-empty-state" style={{ height: 220 }}>
                <span className="an-empty-icon">🥧</span>
                <span>No category data yet</span>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={analytics.categorySpend} innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="amount" stroke="none">
                      {analytics.categorySpend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmt(value)} contentStyle={{ background: "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: "8px", color: "#1F2937" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="an-pie-legend">
                  {analytics.categorySpend.map((c) => (
                    <div key={c.name} className="an-legend-item">
                      <div className="an-legend-dot" style={{ background: c.color }} />
                      {c.name}: ₹{(c.amount / 1000).toFixed(1)}k
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* GOALS & HABITS ROW */}
        <h3 className="an-section-title">Goals & Habits Performance</h3>
        <div className="an-gh-grid">

          {/* GOALS */}
          <div className="an-card">
            <div className="an-gh-header">
              <h2 className="an-gh-title">Savings Goals<br />Progress</h2>
              <div className="an-live-badge">
                {loading ? "—" : `${analytics.goalsProgress.length} Active`}
              </div>
            </div>

            {loading ? (
              <div className="an-progress-list">
                {Array(4).fill(0).map((_, i) => <div key={i} className="an-skeleton-bar" />)}
              </div>
            ) : analytics.goalsProgress.length === 0 ? (
              <div className="an-empty-state" style={{ flex: 1 }}>
                <span className="an-empty-icon">🎯</span>
                <span>No goals added yet</span>
              </div>
            ) : (
              <div className="an-progress-list">
                {analytics.goalsProgress.map((g, i) => (
                  <div key={i} className="an-progress-row">
                    <div className="an-progress-label">{g.name}</div>
                    <div className="an-progress-track">
                      <div
                        className="an-progress-fill"
                        style={{ width: `${g.progress}%`, background: g.color || theme.accent.blue }}
                      />
                    </div>
                    <div className="an-progress-pct" style={{ color: g.color || theme.accent.blue }}>{g.progress}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HABITS */}
          <div className="an-card">
            <div className="an-gh-header">
              <h2 className="an-gh-title">Habit Streak Performance</h2>
              <div className="an-live-badge">
                {loading ? "—" : `${analytics.habitPerformance.length} Habits`}
              </div>
            </div>

            {loading ? (
              <div className="an-progress-list">
                {Array(4).fill(0).map((_, i) => <div key={i} className="an-skeleton-bar" />)}
              </div>
            ) : analytics.habitPerformance.length === 0 ? (
              <div className="an-empty-state" style={{ flex: 1 }}>
                <span className="an-empty-icon">🔥</span>
                <span>No habits tracked yet</span>
              </div>
            ) : (
              <div className="an-progress-list">
                {analytics.habitPerformance.map((h, i) => (
                  <div key={i} className="an-progress-row">
                    <div className="an-progress-label-wide">
                      <span>{h.icon}</span>
                      <span className="an-progress-label-text">{h.name}</span>
                    </div>
                    <div className="an-progress-track">
                      <div
                        className="an-progress-fill"
                        style={{ width: `${h.progress}%`, background: h.color || theme.accent.blue }}
                      />
                    </div>
                    <div className="an-progress-streak">{h.streak}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}