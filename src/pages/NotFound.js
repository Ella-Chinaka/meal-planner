import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page page-narrow empty">
      <h1 className="page-title">Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}

export default NotFound;
