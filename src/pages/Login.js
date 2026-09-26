import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { authErrorMessage, useAuth } from "../context/AuthContext";
import Message from "../components/Message";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  // Already logged in (e.g. opened /login directly). Skipped while submitting so
  // the redirect below decides where to go.
  if (user && !busy) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to see your meal plans.</p>
        <Message type="error">{error}</Message>

        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>

        <button className="btn btn-block" type="submit" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
        <p className="auth-switch">
          New to Quick Diet? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
