import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FavouriteButton } from "../components/MealCard";
import meals from "../meals";
import { filterMeals } from "../utils/planner";

const TYPES = ["all", "breakfast", "lunch", "dinner"];

// Filters live in the URL (?q=&type=&favourites=1&fits=1) so links like
// "Favourite meals" on the dashboard open the page pre-filtered.
function Meals() {
  const { user, profile } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const type = params.get("type") || "all";
  const favouritesOnly = params.get("favourites") === "1";
  const fitsDiet = params.get("fits") === "1";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const favourites = profile?.favourites || [];
  const search = q.trim().toLowerCase();
  let results = fitsDiet ? filterMeals(profile) : meals;
  results = results.filter(
    (m) =>
      (type === "all" || m.mealType === type) &&
      (!favouritesOnly || favourites.includes(m.id)) &&
      (!search ||
        m.name.toLowerCase().includes(search) ||
        m.ingredients.some((i) => i.toLowerCase().includes(search)))
  );

  return (
    <div className="page">
      <h1 className="page-title">All Meals</h1>

      <div className="panel meal-filters">
        <input
          type="search"
          placeholder="Search meals or ingredients (e.g. egusi, plantain)"
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />
        <div className="filter-chips">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`chip ${type === t ? "active" : ""}`}
              onClick={() => setParam("type", t === "all" ? "" : t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
          {user && (
            <>
              <button
                className={`chip ${favouritesOnly ? "active" : ""}`}
                onClick={() => setParam("favourites", favouritesOnly ? "" : "1")}
              >
                ♥ Favourites
              </button>
              <button
                className={`chip ${fitsDiet ? "active" : ""}`}
                onClick={() => setParam("fits", fitsDiet ? "" : "1")}
              >
                Fits my diet
              </button>
            </>
          )}
        </div>
      </div>

      <p className="muted">
        {results.length} {results.length === 1 ? "meal" : "meals"}
        {!user && (
          <>
            {" "}· <Link to="/signup">Sign up</Link> to save favourites
          </>
        )}
      </p>

      {results.length === 0 ? (
        <div className="panel empty">
          <p>
            {favouritesOnly && favourites.length === 0
              ? "You haven't favourited any meals yet. Tap the ♡ on a meal to add it."
              : "No meals match your search."}
          </p>
        </div>
      ) : (
        <div className="meal-browser">
          {results.map((meal) => (
            <div key={meal.id} className="browse-card">
              <FavouriteButton mealId={meal.id} />
              <Link to={`/meals/${meal.id}`}>
                <img src={meal.image} alt={meal.name} />
                <div className="browse-card-body">
                  <span className="plan-badge">{meal.mealType}</span>
                  <h3>{meal.name}</h3>
                  <p className="muted">
                    {meal.calories} kcal · {meal.protein}g protein
                    {meal.vegetarian ? " · Vegetarian" : ""}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Meals;
