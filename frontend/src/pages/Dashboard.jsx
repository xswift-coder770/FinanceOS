 



 import { getAnalytics } from "../services/analyticsServices";
import { exportReport } from "../utils/exportReport";

import Navbar from "../components/common/Navbar";//new
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardServices";
import "../components/common/Navbar.css";
import "../styles/Dashboard.css";


 

const categoryIcons = {
  Food: "🍽️",
  Income: "💰",
  Invest: "📈",
  Bills: "🧾",
  Shopping: "🛒",
  Entertainment: "🎬",
  Transport: "🚗",
  default: "💳",
};

const StatCard = ({
  title,
  value,
  icon,
  gradient,
  change,
  suffix = "",
}) => (
  <div
    className="stat-card"
    style={{ background: gradient }}
  >
    <div className="stat-card-top">
      <span className="stat-icon">{icon}</span>

      <span className="stat-change">
        {change}
      </span>
    </div>

    <div className="stat-value">
      {suffix
        ? value
        : `₹${value.toLocaleString("en-IN")}`}

      {suffix && (
        <span className="stat-suffix">
          {suffix}
        </span>
      )}
    </div>

    <div className="stat-label">
      {title}
    </div>

    <div className="stat-bar-track">
      <div
        className="stat-bar-fill"
        style={{
          width: `${Math.min(
            100,
            (value / 100000) * 100
          )}%`,
        }}
      />
    </div>
  </div>
);

 

export default function Dashboard() {

  const [activeAction, setActiveAction] =
    useState(null);

  

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const fetchDashboard = async () => {

    try {

      const data =
        await getDashboardData();

      setDashboardData(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !dashboardData) {
    return <h1>Loading...</h1>;
  }

  const savingsRate =
    dashboardData.savingsRate || 0;




const handleExportReport = async () => {
  try {

    const analytics =
      await getAnalytics();

    exportReport(analytics);

  } catch (error) {

    console.log(error);

    alert("Failed to generate PDF");
  }
};






  const handleAction = (action) => {

    setActiveAction(action);

    if (action === "Add Expense") {
      navigate("/expenses");
    }

    else if (action === "Add Goal") {
      navigate("/goals");
    }

    else if (action === "Add Habit") {
      navigate("/habits");
    }

   else if (action === "Export") {
  handleExportReport();
}
  };

  return (
    <>

<Navbar />

      <div className="dashboard-container">

        <div className="dashboard-header">

          <div className="header-text">
            <h1>Financial Dashboard</h1>

            <p>
              Track your wealth and
              financial habits
            </p>
          </div>

          <div className="header-badge">

            <div className="header-badge-dot" />

            Live Overview
          </div>
        </div>

        <div className="savings-callout">

          <div className="callout-left">

            <h2>
              Net Savings This Month
            </h2>

            <p>
              ₹
              {dashboardData.totalSavings.toLocaleString(
                "en-IN"
              )}
            </p>

            <span>
              Savings rate:
              {savingsRate}% of income
            </span>
          </div>

          <div className="callout-right">

            <div className="callout-metric">

              <div className="callout-metric-val">
                +{savingsRate}%
              </div>

              <div className="callout-metric-lbl">
                Savings Rate
              </div>
            </div>

            <div className="callout-divider" />

            <div className="callout-metric">

              <div className="callout-metric-val">
                ₹
                {dashboardData.totalSavings.toLocaleString(
                  "en-IN"
                )}
              </div>

              <div className="callout-metric-lbl">
                Net Surplus
              </div>
            </div>

            <div className="callout-divider" />

            <div className="callout-metric">

              <div className="callout-metric-val">
                {
                  dashboardData.activeGoals
                }
              </div>

              <div className="callout-metric-lbl">
                Active Goals
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">

          <StatCard
            title="Total Income"
            value={
              dashboardData.totalIncome
            }
            icon="💼"
            gradient="linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)"
            change="↑ 12.4%"
          />

          <StatCard
            title="Total Expenses"
            value={
              dashboardData.totalExpenses
            }
            icon="📊"
            gradient="linear-gradient(135deg, #1e3a5f 0%, #1d6fa0 100%)"
            change="↓ 3.1%"
          />

          <StatCard
            title="Total Savings"
            value={
              dashboardData.totalSavings
            }
            icon="🏦"
            gradient="linear-gradient(135deg, #1a4480 0%, #3b82f6 100%)"
            change="↑ 8.7%"
          />

          <StatCard
            title="Active Goals"
            value={
              dashboardData.activeGoals
            }
            icon="🎯"
            gradient="linear-gradient(135deg, #0d3b72 0%, #1a73e8 100%)"
            change="2 on track"
            suffix=" Goals"
          />
        </div>

        <div className="dashboard-bottom">

          <div className="card">

            <div className="card-header">

              <span className="card-title">
                Recent Transactions
              </span>

              <span className="card-link">
                View all →
              </span>
            </div>

            <div className="transactions-list">

              {dashboardData.recentTransactions.map(
                (tx) => (

                  <div
                    key={tx._id}
                    className="transaction-item"
                  >

                    <div
                      className={`tx-icon-wrap ${
                        tx.type === "income"
                          ? "credit"
                          : "debit"
                      }`}
                    >
                      {categoryIcons[
                        tx.category
                      ] ||
                        categoryIcons.default}
                    </div>

                    <div className="tx-meta">

                      <div className="tx-label">
                        {tx.title}
                      </div>

                      <div className="tx-date">
                        {new Date(
                          tx.date
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      className={`tx-amount ${
                        tx.type === "income"
                          ? "positive"
                          : "negative"
                      }`}
                    >
                      {tx.type === "income"
                        ? "+"
                        : "-"}

                      ₹
                      {tx.amount.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="right-panel">

            <div className="card progress-card">

              <div
                className="card-header"
                style={{
                  padding: "0 0 16px",
                }}
              >

                <span className="card-title">
                  Budget Progress
                </span>

                <span className="card-link">
                  Edit
                </span>
              </div>

              {dashboardData.budgetProgress.map(
                (item) => (

                  <div
                    key={item.category}
                    className="progress-item"
                  >

                    <div className="progress-header">

                      <span className="progress-label">
                        {item.category}
                      </span>

                      <span className="progress-pct">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          background:
                            "linear-gradient(90deg,#2563eb,#60a5fa)",
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="card quick-actions-card">

              <div
                className="card-header"
                style={{
                  padding: "0 0 0",
                }}
              >

                <span className="card-title">
                  Quick Actions
                </span>
              </div>

              <div className="actions-grid">

                {[
                  {
                    icon: "➕",
                    label: "Add Expense",
                  },
                  {
                    icon: "🎯",
                    label: "Add Goal",
                  },
                  {
                    icon: "🔁",
                    label: "Add Habit",
                  },
                  {
                    icon: "📤",
                    label: "Export",
                  },
                ].map((action) => (

                  <button
                    key={action.label}
                    className={`action-btn ${
                      activeAction ===
                      action.label
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleAction(
                        action.label
                      )
                    }
                  >

                    <span className="action-btn-icon">
                      {action.icon}
                    </span>

                    <span className="action-btn-label">
                      {action.label}
                    </span>

                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}