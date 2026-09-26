import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Loading() {
  return <div className="loading">Loading…</div>;
}

// Pages that need an account. Sends visitors to login and back here afterwards.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Login/signup pages: no point showing them to someone already logged in.
export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
