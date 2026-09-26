import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import PlanView from "../components/PlanView";
import { usePlanActions } from "../hooks/usePlanActions";
import { getPlan } from "../services/db";

function PlanDetail() {
  const { planId } = useParams();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const actions = usePlanActions(plan, setPlan, planId);

  useEffect(() => {
    getPlan(user.uid, planId)
      .then((p) => (p ? setPlan(p) : setError("This plan doesn't exist or was deleted.")))
      .catch((err) => setError("Couldn't load the plan. " + err.message))
      .finally(() => setLoading(false));
  }, [user.uid, planId]);

  return (
    <div className="page">
      <Link to="/plans">← All saved plans</Link>
      <Message type="error">{error || actions.error}</Message>
      {loading && <p>Loading…</p>}
      {plan && (
        <>
          <p className="muted">
            Saved on {new Date(plan.createdAt).toLocaleString()}. Swaps and shopping ticks save automatically.
          </p>
          <PlanView
            plan={plan}
            onSwap={actions.swap}
            onToggleItem={actions.toggleItem}
            swapping={actions.swapping}
          />
        </>
      )}
    </div>
  );
}

export default PlanDetail;
