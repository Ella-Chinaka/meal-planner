import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import PlanView from "../components/PlanView";
import { usePlanActions } from "../hooks/usePlanActions";
import { savePlan } from "../services/db";
import { generatePlan } from "../utils/planner";
import { AVOIDABLE, DIETS, MIN_CALORIES } from "../utils/nutrition";

function describePrefs(profile) {
  const parts = [];
  if (profile?.diet && profile.diet !== "none") {
    parts.push(DIETS.find((d) => d.value === profile.diet)?.label);
  }
  if (profile?.avoid?.length) {
    const names = profile.avoid.map((v) => AVOIDABLE.find((a) => a.value === v)?.label || v);
    parts.push("avoiding " + names.join(", ").toLowerCase());
  }
  return parts.join("; ");
}

function Planner() {
  const { user, profile } = useAuth();
  const [calories, setCalories] = useState(profile?.calorieTarget || "");
  const [plan, setPlan] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const planRef = useRef(null);
  const actions = usePlanActions(plan, setPlan, savedId);

  const generate = (type) => {
    setError("");
    const target = Number(calories);
    if (!target || target < MIN_CALORIES) {
      setError(`Please enter a calorie target of at least ${MIN_CALORIES}.`);
      return;
    }
    if (target > 6000) {
      setError("That calorie target looks too high. Please enter 6000 or less.");
      return;
    }
    try {
      setPlan(generatePlan({ type, calorieTarget: target, prefs: profile }));
      setSavedId(null);
      setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      setSavedId(await savePlan(user.uid, plan));
    } catch (err) {
      setError("Couldn't save the plan. " + err.message);
    }
    setSaving(false);
  };

  const prefs = describePrefs(profile);

  return (
    <div className="page">
      <h1 className="page-title">Meal Planner</h1>

      <section className="panel planner-controls">
        <label>
          Daily calorie target
          <input
            type="number"
            min={MIN_CALORIES}
            placeholder="e.g. 2000"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </label>
        <div className="planner-buttons">
          <button className="btn" onClick={() => generate("daily")}>Generate Daily Plan</button>
          <button className="btn" onClick={() => generate("weekly")}>Generate 7-Day Plan</button>
        </div>
        <p className="muted">
          {profile?.calorieTarget
            ? `Your profile target is ${profile.calorieTarget} kcal. `
            : "Tip: complete your profile and we'll calculate a target for you. "}
          {prefs ? `Plans follow your preferences: ${prefs}. ` : ""}
          <Link to="/profile">Edit profile</Link>
        </p>
        <Message type="error">{error || actions.error}</Message>
      </section>

      <div ref={planRef}>
        {plan && (
          <>
            <div className="save-bar">
              {savedId ? (
                <Message type="success">
                  Plan saved. Swaps and shopping ticks now save automatically.{" "}
                  <Link to={`/plans/${savedId}`}>Open in My Plans →</Link>
                </Message>
              ) : (
                <>
                  <span>Happy with this plan? Save it to your account.</span>
                  <button className="btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save plan"}
                  </button>
                </>
              )}
            </div>
            <PlanView
              plan={plan}
              onSwap={actions.swap}
              onToggleItem={actions.toggleItem}
              swapping={actions.swapping}
              shoppingNote={savedId ? null : "Save this plan to keep your ticks."}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Planner;
