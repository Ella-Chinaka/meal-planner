import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import { getMealLog, listLoggedDates, listPlans, setMealLog } from "../services/db";
import { currentStreak, dateKey, weekdayIndex } from "../utils/dates";
import { computeDay } from "../utils/planner";
import { isProfileComplete } from "../utils/nutrition";

const SLOT_LABELS = ["Breakfast", "Lunch", "Dinner"];

// Today's meals come from the most recently saved plan: the matching weekday
// for a 7-day plan, or the single day of a daily plan.
function todaysDay(plan) {
  if (!plan) return null;
  const day = plan.type === "weekly" ? plan.days[weekdayIndex()] : plan.days[0];
  return computeDay(day, plan.calorieTarget);
}

function Dashboard() {
  const { user, profile } = useAuth();
  const [latestPlan, setLatestPlan] = useState(null);
  const [planCount, setPlanCount] = useState(0);
  const [eaten, setEaten] = useState([]);
  const [loggedDates, setLoggedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = dateKey();

  useEffect(() => {
    Promise.all([listPlans(user.uid), getMealLog(user.uid, today), listLoggedDates(user.uid)])
      .then(([plans, log, dates]) => {
        setLatestPlan(plans[0] || null);
        setPlanCount(plans.length);
        setEaten(log.eaten || []);
        setLoggedDates(dates);
      })
      .catch((err) => setError("Couldn't load your dashboard. " + err.message))
      .finally(() => setLoading(false));
  }, [user.uid, today]);

  const toggleEaten = async (mealId) => {
    const next = eaten.includes(mealId) ? eaten.filter((id) => id !== mealId) : [...eaten, mealId];
    setEaten(next);
    setLoggedDates((dates) => {
      const others = dates.filter((d) => d !== today);
      return next.length ? [...others, today] : others;
    });
    try {
      await setMealLog(user.uid, today, next);
    } catch (err) {
      setError("Couldn't save that. " + err.message);
    }
  };

  const day = todaysDay(latestPlan);
  const streak = currentStreak(loggedDates);
  const firstName = (profile?.name || user.displayName || "").split(" ")[0];

  return (
    <div className="page">
      <h1 className="page-title">Hello{firstName ? `, ${firstName}` : ""} 👋</h1>
      <Message type="error">{error}</Message>

      {!isProfileComplete(profile) && (
        <Message type="info">
          Complete your <Link to="/profile">profile</Link> to get a personalized calorie target and
          meals that match your diet.
        </Message>
      )}

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Daily calorie target</span>
          <span className="stat-value">{profile?.calorieTarget ? `${profile.calorieTarget}` : "—"}</span>
          <span className="stat-unit">kcal</span>
        </div>
        <div className="stat">
          <span className="stat-label">Meal streak</span>
          <span className="stat-value">{streak}</span>
          <span className="stat-unit">{streak === 1 ? "day" : "days"}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Current weight</span>
          <span className="stat-value">{profile?.weight || "—"}</span>
          <span className="stat-unit">kg</span>
        </div>
        <div className="stat">
          <span className="stat-label">Saved plans</span>
          <span className="stat-value">{loading ? "…" : planCount}</span>
          <span className="stat-unit">plans</span>
        </div>
      </div>

      <section className="panel">
        <h2>Today's meals</h2>
        {loading ? (
          <p>Loading…</p>
        ) : day ? (
          <>
            <p className="muted">
              From your latest saved plan. Tick meals off as you eat them to build your streak.
            </p>
            <ul className="today-list">
              {day.meals.map((meal, slot) => (
                <li key={slot} className={eaten.includes(meal.id) ? "eaten" : ""}>
                  <label>
                    <input
                      type="checkbox"
                      checked={eaten.includes(meal.id)}
                      onChange={() => toggleEaten(meal.id)}
                    />
                    <img src={meal.image} alt="" />
                    <span>
                      <small>{SLOT_LABELS[slot]}</small>
                      {meal.name}
                    </span>
                    <span className="today-kcal">{meal.calories} kcal</span>
                  </label>
                </li>
              ))}
            </ul>
            <Link to={`/plans/${latestPlan.id}`}>View full plan →</Link>
          </>
        ) : (
          <p>
            You haven't saved a plan yet. <Link to="/planner">Create your first plan</Link> and save it
            to see today's meals here.
          </p>
        )}
      </section>

      <div className="quick-links">
        <Link to="/planner" className="quick-link">🍲 New meal plan</Link>
        <Link to="/plans" className="quick-link">📋 My saved plans</Link>
        <Link to="/meals?favourites=1" className="quick-link">♥ Favourite meals</Link>
        <Link to="/progress" className="quick-link">📈 Log weight</Link>
      </div>
    </div>
  );
}

export default Dashboard;
