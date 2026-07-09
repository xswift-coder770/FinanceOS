  


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authServices.js";
import toast from "react-hot-toast";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        const mapped = {};
        apiErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      {/* Ambient background elements */}
      <div className="lg-orb1" />
      <div className="lg-orb2" />
      <div className="lg-grid" />

      <div className="lg-container">
        {/* Left panel */}
        <div className="lg-left-panel">
          <div className="lg-brand-mark">
            <div className="lg-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
                <path d="M14 7L21 11V17L14 21L7 17V11L14 7Z" fill="#c9a84c" opacity="0.2" />
                <circle cx="14" cy="14" r="3" fill="#c9a84c" />
              </svg>
            </div>
            <span className="lg-brand-name">FinanceOS</span>
          </div>

          <div className="lg-hero-content">
            <div className="lg-tagline">Your Financial Future</div>
            <h1 className="lg-hero-heading">
              Build Habits.<br />
              <span className="lg-gold-text">Grow Wealth.</span>
            </h1>
            <p className="lg-hero-subtext">
              Track every rupee, build lasting financial habits, and watch your wealth compound over time.
            </p>
          </div>

          <div className="lg-stats-row">
            {[
              { value: "₹2.4Cr+", label: "Wealth Tracked" },
              { value: "12K+", label: "Active Users" },
              { value: "94%", label: "Habit Rate" },
            ].map((s) => (
              <div key={s.label} className="lg-stat">
                <div className="lg-stat-value">{s.value}</div>
                <div className="lg-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="lg-right-panel">
          <div className="lg-card">
            <div className="lg-card-header">
              <h2 className="lg-card-title">Welcome back</h2>
              <p className="lg-card-subtitle">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="lg-form">
              {/* Email */}
              <div className="lg-field">
                <label className="lg-label" htmlFor="email">Email Address</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 8l10 6 10-6" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`lg-input ${errors.email ? "lg-input-error" : ""}`}
                  />
                </div>
                {errors.email && <span className="lg-error-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="lg-field">
                <div className="lg-field-top-row">
                  <label className="lg-label" htmlFor="password">Password</label>
                  <button type="button" className="lg-forgot-link">Forgot password?</button>
                </div>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`lg-input ${errors.password ? "lg-input-error" : ""}`}
                    style={{ paddingRight: "48px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="lg-eye-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="lg-error-msg">{errors.password}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`lg-submit-btn ${loading ? "disabled" : ""}`}
              >
                {loading ? (
                  <span className="lg-btn-loading-row">
                    <span className="lg-btn-spinner" />
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <div className="lg-divider">
              <span className="lg-divider-line" />
              <span className="lg-divider-text">or</span>
              <span className="lg-divider-line" />
            </div>

            <p className="lg-switch-text">
              Don't have an account?{" "}
              <Link to="/register" className="lg-switch-link">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
