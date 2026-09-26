import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import WeightChart from "../components/WeightChart";
import { deleteWeight, listLoggedDates, listWeights, logWeight } from "../services/db";
import { addDays, currentStreak, dateKey, formatDateKey } from "../utils/dates";
import { calculateCalorieTarget, isProfileComplete } from "../utils/nutrition";

const CALENDAR_DAYS = 28;

function Progress() {
  const { user, profile, updateProfile } = useAuth();
  const [weights, setWeights] = useState([]);
  const [loggedDates, setLoggedDates] = useState([]);
  const [date, setDate] = useState(dateKey());
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listWeights(user.uid), listLoggedDates(user.uid)])
      .then(([w, d]) => {
        setWeights(w);
        setLoggedDates(d);
      })
      .catch((err) => setError("Couldn't load your progress. " + err.message))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleLog = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const value = Number(weight);
    if (!value || value < 30 || value > 300) return setError("Enter a weight between 30 and 300 kg.");
    if (date > dateKey()) return setError("You can't log a weight for a future date.");

    try {
      await logWeight(user.uid, date, value);
      const next = [...weights.filter((w) => w.date !== date), { date, weight: value }].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      setWeights(next);

      // The newest entry is the current weight; keep the profile and calorie target in step.
      const latest = next[next.length - 1];
      if (latest.date === date) {
        const changes = { weight: value };
        if (isProfileComplete(profile)) {
          changes.calorieTarget = calculateCalorieTarget({ ...profile, weight: value });
        }
        await updateProfile(changes);
      }
      setWeight("");
      setSuccess("Weight logged.");
    } catch (err) {
      setError("Couldn't save your weight. " + err.message);
    }
  };

  const handleDelete = async (entryDate) => {
    try {
      await deleteWeight(user.uid, entryDate);
      setWeights((list) => list.filter((w) => w.date !== entryDate));
    } catch (err) {
      setError("Couldn't delete that entry. " + err.message);
    }
  };

  const first = weights[0];
  const last = weights[weights.length - 1];
  const change = first && last ? Math.round((last.weight - first.weight) * 10) / 10 : null;
  const streak = currentStreak(loggedDates);
  const logged = new Set(loggedDates);
  const calendar = Array.from({ length: CALENDAR_DAYS }, (_, i) =>
    dateKey(addDays(new Date(), i - CALENDAR_DAYS + 1))
  );

  return (
    <div className="page">
      <h1 className="page-title">Your Progress</h1>
      <Message type="error">{error}</Message>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Current weight</span>
          <span className="stat-value">{last ? last.weight : "—"}</span>
          <span className="stat-unit">kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">Change since first entry</span>
          <span className="stat-value">{change === null ? "—" : `${change > 0 ? "+" : ""}${change}`}</span>
          <span className="stat-unit">kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">Meal streak</span>
          <span className="stat-value">{streak}</span>
          <span className="stat-unit">{streak === 1 ? "day" : "days"}</span>
        </div>
      </div>

      <section className="panel">
        <h2>Log your weight</h2>
        <form className="inline-form" onSubmit={handleLog}>
          <label>
            Date
            <input type="date" value={date} max={dateKey()} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>
            Weight (kg)
            <input
              type="number"
              step="0.1"
              min="30"
              max="300"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </label>
          <button className="btn" type="submit">Log weight</button>
        </form>
        <Message type="success">{success}</Message>
      </section>

      <section className="panel">
        <h2>Weight over time</h2>
        {loading ? (
          <p>Loading…</p>
        ) : weights.length === 0 ? (
          <p className="muted">No entries yet. Log your weight above to start your chart.</p>
        ) : (
          <>
            <WeightChart entries={weights} />
            <details className="weight-table">
              <summary>Show all entries ({weights.length})</summary>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {[...weights].reverse().map((w) => (
                    <tr key={w.date}>
                      <td>{formatDateKey(w.date, { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td>{w.weight}</td>
                      <td>
                        <button className="link-button" onClick={() => handleDelete(w.date)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </>
        )}
      </section>

      <section className="panel">
        <h2>Last 4 weeks</h2>
        <p className="muted">Days where you ticked off at least one meal on your dashboard.</p>
        <div className="streak-calendar">
          {calendar.map((key) => (
            <div
              key={key}
              className={`streak-day ${logged.has(key) ? "logged" : ""}`}
              title={`${formatDateKey(key)}${logged.has(key) ? ": meals logged" : ""}`}
            >
              <span>{Number(key.slice(8))}</span>
              {logged.has(key) && <span aria-label="logged">✓</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Progress;
