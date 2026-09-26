import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { isFirebaseConfigured } from "./firebase";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Plans from "./pages/Plans";
import PlanDetail from "./pages/PlanDetail";
import Meals from "./pages/Meals";
import MealDetail from "./pages/MealDetail";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";

function SetupNotice() {
  return (
    <div className="page page-narrow">
      <h1 className="page-title">Firebase isn't configured yet</h1>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Firebase web app
        config, then restart <code>npm start</code>. See the README for step-by-step setup.
      </p>
    </div>
  );
}

const protect = (page) => <ProtectedRoute>{page}</ProtectedRoute>;
const publicOnly = (page) => <PublicOnlyRoute>{page}</PublicOnlyRoute>;

function App() {
  if (!isFirebaseConfigured) return <SetupNotice />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/meals/:mealId" element={<MealDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={publicOnly(<ForgotPassword />)} />
              <Route path="/dashboard" element={protect(<Dashboard />)} />
              <Route path="/planner" element={protect(<Planner />)} />
              <Route path="/plans" element={protect(<Plans />)} />
              <Route path="/plans/:planId" element={protect(<PlanDetail />)} />
              <Route path="/profile" element={protect(<Profile />)} />
              <Route path="/progress" element={protect(<Progress />)} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer>
            <p>© {new Date().getFullYear()} Quick Diet. All Rights Reserved.</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
