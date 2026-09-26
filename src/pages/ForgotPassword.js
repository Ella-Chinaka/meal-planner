import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authErrorMessage, useAuth } from "../context/AuthContext";
import Message from "../components/Message";

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset your password</h2>
        <p className="auth-subtitle">We'll email you a link to choose a new password.</p>
        <Message type="error">{error}</Message>
        {sent ? (
          <Message type="success">
            If an account exists for {email}, a reset link is on its way. Check your inbox and spam folder.
          </Message>
        ) : (
          <>
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
            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </>
        )}
        <p className="auth-switch">
          <Link to="/login">Back to log in</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
