import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* NAVBAR */}

      <nav className="home-navbar">
        <div className="logo-section">
          <div className="logo-box">💰</div>

          <h2>FinanceOS</h2>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#analytics">Analytics</a>
          <a href="#goals">Goals</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}

      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">Smart Financial Habit Builder</span>

          <h1>Build Better Financial Habits & Grow Your Wealth Smarter</h1>

          <p>
            Track expenses, manage savings goals, monitor financial growth, and
            create disciplined money habits — all in one powerful modern
            platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <Link to="/dashboard" className="secondary-btn">
              View Dashboard
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-box">
              <h2>10K+</h2>
              <p>Users</p>
            </div>

            <div className="stat-box">
              <h2>₹25Cr+</h2>
              <p>Tracked Savings</p>
            </div>

            <div className="stat-box">
              <h2>95%</h2>
              <p>Goal Completion</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
              alt="Finance Dashboard"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}

      <section className="features-section" id="features">
        <h1>Powerful Financial Features</h1>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>

            <h2>Expense Tracking</h2>

            <p>
              Monitor daily spending with intelligent categorization and
              reports.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>

            <h2>Savings Goals</h2>

            <p>Set goals and visually track your progress in real-time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔥</div>

            <h2>Habit Building</h2>

            <p>Build strong financial habits with streaks and reminders.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>

            <h2>Wealth Analytics</h2>

            <p>
              Understand your financial growth using modern analytics
              dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* ANALYTICS SECTION */}

      <section className="analytics-section" id="analytics">
        <div className="analytics-left">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
            alt="Analytics"
          />
        </div>

        <div className="analytics-right">
          <span>Advanced Analytics</span>

          <h1>Understand Your Financial Journey</h1>

          <p>
            Get deep insights into your income, expenses, savings, investments,
            and financial discipline through elegant analytics and charts.
          </p>

          <ul>
            <li>✔ Smart Expense Reports</li>
            <li>✔ Monthly Financial Trends</li>
            <li>✔ Savings Performance</li>
            <li>✔ Habit Completion Metrics</li>
          </ul>
        </div>
      </section>

      {/* CTA SECTION */}

      <section className="cta-section">
        <h1>Start Building Financial Freedom Today</h1>

        <p>Join thousands of users improving their financial habits daily.</p>

        <Link to="/register" className="cta-btn">
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}

      <footer className="footer" id="contact">
        <div className="footer-grid">
          <div>
            <h2>FinanceOS</h2>

            <p>Financial Habit Builder & Wealth Growth Tracker Platform.</p>
          </div>

          <div>
            <h3>Quick Links</h3>

            <a href="#">Dashboard</a>
            <a href="#">Goals</a>
            <a href="#">Analytics</a>
          </div>

          <div>
            <h3>Contact</h3>

            <p>support@financeos.com</p>
            <p>+91 9876543210</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 FinanceOS. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;

 