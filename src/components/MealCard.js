import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function FavouriteButton({ mealId }) {
  const { user, profile, toggleFavourite } = useAuth();
  if (!user) return null;
  const isFav = profile?.favourites?.includes(mealId);
  return (
    <button
      className={`fav-btn ${isFav ? "active" : ""}`}
      onClick={() => toggleFavourite(mealId)}
      aria-pressed={isFav}
      title={isFav ? "Remove from favourites" : "Add to favourites"}
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}

// label: "Breakfast" etc. onSwap is optional; when given, a "Swap" button is shown.
function MealCard({ meal, label, onSwap, swapping }) {
  const showPortion = meal.portion && Math.abs(meal.portion - 1) >= 0.05;

  return (
    <div className="meal-card">
      <FavouriteButton mealId={meal.id} />
      {label && <h2>{label}</h2>}
      <Link to={`/meals/${meal.id}`} className="meal-card-link">
        <img src={meal.image} alt={meal.name} />
        <h3>{meal.name}</h3>
      </Link>
      {showPortion && <p className="portion">Portion: {meal.portion.toFixed(2)}× standard</p>}
      <p>{meal.instructions}</p>
      <ul className="macro-list">
        <li>Calories: {meal.calories}</li>
        <li>Carbs: {meal.carbohydrate}g</li>
        <li>Protein: {meal.protein}g</li>
        <li>Fat: {meal.fat}g</li>
      </ul>
      {onSwap && (
        <button className="btn btn-outline btn-small" onClick={onSwap} disabled={swapping}>
          ⇄ Swap meal
        </button>
      )}
    </div>
  );
}

export default MealCard;
