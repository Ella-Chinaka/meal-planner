import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import { deletePlan, listPlans } from "../services/db";
import { getMealById } from "../utils/planner";

function Plans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    listPlans(user.uid)
      .then(setPlans)
      .catch((err) => setError("Couldn't load your plans. " + err.message))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleDelete = async (id) => {
    setError("");
    try {
      await deletePlan(user.uid, id);
      setPlans((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      setError("Couldn't delete the plan. " + err.message);
    }
    setConfirmId(null);
  };

  return (
    <div className="page">
      <h1 className="page-title">My Saved Plans</h1>
      <Message type="error">{error}</Message>

      {loading ? (
        <p>Loading…</p>
      ) : plans.length === 0 ? (
        <div className="panel empty">
          <p>No saved plans yet.</p>
          <Link to="/planner" className="btn">Create a plan</Link>
        </div>
      ) : (
        <ul className="plan-list">
          {plans.map((plan) => {
            const firstDay = plan.days[0].mealIds.map((id) => getMealById(id)?.name).filter(Boolean);
            return (
              <li key={plan.id} className="plan-item">
                <Link to={`/plans/${plan.id}`} className="plan-item-main">
                  <span className="plan-badge">{plan.type === "weekly" ? "7-day" : "Daily"}</span>
                  <strong>
                    {new Date(plan.createdAt).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                  <span className="muted">
                    {plan.calorieTarget} kcal/day · {firstDay.join(", ")}
                    {plan.type === "weekly" ? " …" : ""}
                  </span>
                </Link>
                {confirmId === plan.id ? (
                  <span className="confirm-delete">
                    Delete?
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(plan.id)}>
                      Yes
                    </button>
                    <button className="btn btn-outline btn-small" onClick={() => setConfirmId(null)}>
                      No
                    </button>
                  </span>
                ) : (
                  <button className="btn btn-outline btn-small" onClick={() => setConfirmId(plan.id)}>
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Plans;
