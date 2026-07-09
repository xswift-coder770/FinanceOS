 



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authServices";
import toast from "react-hot-toast";
import "../styles/Register.css";

// Password strength scorer
const getPasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#^()_+\-=]/.test(password),
  };
  score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = ["", "#ff6b6b", "#ffa94d", "#f7c948", "#52c97e", "#52c97e"];

const EyeIcon = ({ show }) =>
  show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { score: pwStrength, checks: pwChecks } = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (pwStrength < 4) e.password = "Password is too weak — fulfill all requirements below";

    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";

    if (!agreed) e.terms = "You must agree to the Terms & Privacy Policy";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await registerUser(form);
      login(data.token, data.user);
      toast.success("Account created! Welcome to WealthFlow 🎉");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        const mapped = {};
        apiErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
        if (mapped.email) toast.error(mapped.email);
      } else {
        toast.error(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-orb1" />
      <div className="rg-orb2" />
      <div className="rg-grid" />

      <div className="rg-container">
        {/* Left panel */}
        <div className="rg-left-panel">
          <div className="rg-brand-mark">
            <div className="rg-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
                <path d="M14 7L21 11V17L14 21L7 17V11L14 7Z" fill="#c9a84c" opacity="0.2" />
                <circle cx="14" cy="14" r="3" fill="#c9a84c" />
              </svg>
            </div>
            <span className="rg-brand-name">FinanceOS</span>
          </div>

          <div className="rg-hero-content">
            <div className="rg-tagline">Start Your Journey</div>
            <h1 className="rg-hero-heading">
              One Account.<br />
              <span className="rg-gold-text">Infinite Growth.</span>
            </h1>
            <p className="rg-hero-subtext">
              Join thousands of individuals building real financial habits and growing their net worth every single day.
            </p>
          </div>

          <div className="rg-feature-list">
            {[
              { icon: "📊", text: "Visual wealth growth tracking" },
              { icon: "🎯", text: "Smart savings goal management" },
              { icon: "🔔", text: "Daily habit reminders & streaks" },
              { icon: "🔒", text: "Bank-grade data security" },
            ].map((f) => (
              <div key={f.text} className="rg-feature-item">
                <span className="rg-feature-icon">{f.icon}</span>
                <span className="rg-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="rg-right-panel">
          <div className="rg-card">
            <div className="rg-card-header">
              <h2 className="rg-card-title">Create account</h2>
              <p className="rg-card-subtitle">Free forever — no credit card required</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="rg-form">
              {/* Name */}
              <div className="rg-field">
                <label className="rg-label" htmlFor="name">Full Name</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    autoComplete="name"
                    className={`rg-input ${errors.name ? "rg-input-error" : ""}`}
                  />
                </div>
                {errors.name && <span className="rg-error-msg">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="rg-field">
                <label className="rg-label" htmlFor="email">Email Address</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                    placeholder="arjun@example.com"
                    autoComplete="email"
                    className={`rg-input ${errors.email ? "rg-input-error" : ""}`}
                  />
                </div>
                {errors.email && <span className="rg-error-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="rg-field">
                <label className="rg-label" htmlFor="password">Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={`rg-input ${errors.password ? "rg-input-error" : ""}`}
                    style={{ paddingRight: "48px" }}
                  />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="rg-eye-btn" aria-label="Toggle password">
                    <EyeIcon show={showPassword} />
                  </button>
                </div>

                {/* Strength meter */}
                {form.password && (
                  <div className="rg-strength-wrap">
                    <div className="rg-strength-bars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="rg-strength-bar"
                          style={{ background: i <= pwStrength ? strengthColors[pwStrength] : undefined }}
                        />
                      ))}
                    </div>
                    <span className="rg-strength-label" style={{ color: strengthColors[pwStrength] }}>
                      {strengthLabel[pwStrength]}
                    </span>
                  </div>
                )}

                {/* Requirements checklist */}
                {form.password && (
                  <div className="rg-req-list">
                    {[
                      { key: "length", label: "At least 8 characters" },
                      { key: "upper", label: "One uppercase letter" },
                      { key: "lower", label: "One lowercase letter" },
                      { key: "number", label: "One number" },
                      { key: "special", label: "One special character" },
                    ].map((r) => (
                      <div key={r.key} className="rg-req-item">
                        <span className={`rg-req-check ${pwChecks[r.key] ? "met" : "unmet"}`}>
                          {pwChecks[r.key] ? "✓" : "○"}
                        </span>
                        <span className={`rg-req-text ${pwChecks[r.key] ? "met" : "unmet"}`}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {errors.password && <span className="rg-error-msg">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="rg-field">
                <label className="rg-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 12l2 2 4-4" />
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className={`rg-input ${errors.confirmPassword ? "rg-input-error" : ""}`}
                    style={{ paddingRight: "48px" }}
                  />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)} className="rg-eye-btn" aria-label="Toggle confirm password">
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                  <span className="rg-match-msg">✓ Passwords match</span>
                )}
                {errors.confirmPassword && <span className="rg-error-msg">{errors.confirmPassword}</span>}
              </div>

              {/* Terms */}
              <div className="rg-terms-row">
                <label className="rg-checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); if (errors.terms) setErrors((p) => ({ ...p, terms: "" })); }}
                    className="rg-checkbox"
                  />
                  <span className="rg-terms-text">
                    I agree to the{" "}
                    <span className="rg-terms-link">Terms of Service</span>
                    {" "}and{" "}
                    <span className="rg-terms-link">Privacy Policy</span>
                  </span>
                </label>
                {errors.terms && <div className="rg-error-msg" style={{ marginTop: "4px" }}>{errors.terms}</div>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`rg-submit-btn ${loading ? "disabled" : ""}`}
              >
                {loading ? (
                  <span className="rg-btn-loading-row">
                    <span className="rg-btn-spinner" />
                    Creating account…
                  </span>
                ) : "Create My Account"}
              </button>
            </form>

            <p className="rg-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="rg-switch-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
