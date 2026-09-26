import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authErrorMessage, useAuth } from "../context/AuthContext";
import Message from "../components/Message";

function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already logged in. Skipped while submitting so new users land on /profile.
  if (user && !busy) return <Navigate to="/dashboard" replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");

    setBusy(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      // New users set up their profile first so we can calculate a calorie target.
      navigate("/profile", { replace: true, state: { welcome: true } });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Save plans, track progress and get personalized targets.</p>
        <Message type="error">{error}</Message>

        <label>
          Full name
          <input type="text" autoComplete="name" value={form.name} onChange={update("name")} required />
        </label>
        <label>
          Email
          <input type="email" autoComplete="email" value={form.email} onChange={update("email")} required />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            minLength={6}
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={update("confirm")}
            required
          />
        </label>

        <button className="btn btn-block" type="submit" disabled={busy}>
          {busy ? "Creating account…" : "Sign up"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
