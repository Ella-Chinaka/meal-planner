import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import { logWeight } from "../services/db";
import { dateKey } from "../utils/dates";
import {
  ACTIVITY_LEVELS,
  AVOIDABLE,
  DIETS,
  GOALS,
  calculateCalorieTarget,
} from "../utils/nutrition";

function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    height: profile?.height || "",
    weight: profile?.weight || "",
    activity: profile?.activity || "moderate",
    goal: profile?.goal || "maintain",
    diet: profile?.diet || "none",
    avoid: profile?.avoid || [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const target = calculateCalorieTarget(form);

  const update = (field) => (e) => {
    setSuccess("");
    setForm({ ...form, [field]: e.target.value });
  };

  const toggleAvoid = (value) => {
    setSuccess("");
    setForm({
      ...form,
      avoid: form.avoid.includes(value)
        ? form.avoid.filter((v) => v !== value)
        : [...form.avoid, value],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);
    if (age < 13 || age > 100) return setError("Age must be between 13 and 100.");
    if (height < 100 || height > 250) return setError("Height must be between 100 and 250 cm.");
    if (weight < 30 || weight > 300) return setError("Weight must be between 30 and 300 kg.");
    if (!form.gender) return setError("Please select your sex for the calorie calculation.");

    setBusy(true);
    try {
      const weightChanged = weight !== Number(profile?.weight);
      await updateProfile({
        ...form,
        name: form.name.trim(),
        age,
        height,
        weight,
        calorieTarget: target,
      });
      // Keep the progress chart in sync when weight changes here.
      if (weightChanged) await logWeight(user.uid, dateKey(), weight);
      setSuccess("Profile saved.");
    } catch (err) {
      setError("Couldn't save your profile. " + err.message);
    }
    setBusy(false);
  };

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Your Profile</h1>
      {location.state?.welcome && !profile?.calorieTarget && (
        <Message type="info">
          Welcome to Quick Diet! Fill in your details so we can work out your daily calorie target.
        </Message>
      )}

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <Message type="error">{error}</Message>

        <label className="span-2">
          Name
          <input type="text" value={form.name} onChange={update("name")} required />
        </label>
        <label>
          Age
          <input type="number" min="13" max="100" value={form.age} onChange={update("age")} required />
        </label>
        <label>
          Sex
          <select value={form.gender} onChange={update("gender")} required>
            <option value="">Select…</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label>
          Height (cm)
          <input type="number" min="100" max="250" value={form.height} onChange={update("height")} required />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={form.weight}
            onChange={update("weight")}
            required
          />
        </label>
        <label className="span-2">
          Activity level
          <select value={form.activity} onChange={update("activity")}>
            {ACTIVITY_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </label>
        <label>
          Goal
          <select value={form.goal} onChange={update("goal")}>
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </label>
        <label>
          Diet
          <select value={form.diet} onChange={update("diet")}>
            {DIETS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </label>

        <fieldset className="span-2">
          <legend>Avoid (allergies or foods you don't eat)</legend>
          <div className="checkbox-grid">
            {AVOIDABLE.map((a) => (
              <label key={a.value} className="checkbox">
                <input
                  type="checkbox"
                  checked={form.avoid.includes(a.value)}
                  onChange={() => toggleAvoid(a.value)}
                />
                {a.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="calorie-result span-2">
          {target ? (
            <>
              Your daily calorie target: <strong>{target} kcal</strong>
            </>
          ) : (
            "Fill in age, sex, height and weight to see your calorie target."
          )}
        </div>

        <div className="span-2">
          <Message type="success">
            {success && (
              <>
                {success} <Link to="/planner">Start planning →</Link>
              </>
            )}
          </Message>
          <button className="btn btn-block" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
