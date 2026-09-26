import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const handleLogout = async () => {
    close();
    await logout();
    navigate("/");
  };

  const name = profile?.name || user?.displayName || "there";

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" onClick={close}>
        Quick Diet
      </Link>
      <button
        className="navbar-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
      <nav className={`navbar-links ${open ? "open" : ""}`}>
        {user && (
          <>
            <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
            <NavLink to="/planner" onClick={close}>Planner</NavLink>
            <NavLink to="/plans" onClick={close}>My Plans</NavLink>
          </>
        )}
        <NavLink to="/meals" onClick={close}>Meals</NavLink>
        {user ? (
          <>
            <NavLink to="/progress" onClick={close}>Progress</NavLink>
            <NavLink to="/profile" onClick={close}>Profile</NavLink>
            <span className="navbar-user">Hi, {name.split(" ")[0]}</span>
            <button className="btn btn-outline btn-small" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={close}>Log in</NavLink>
            <Link to="/signup" className="btn btn-small" onClick={close}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
