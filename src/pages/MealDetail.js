import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FavouriteButton } from "../components/MealCard";
import { useAuth } from "../context/AuthContext";
import { AVOIDABLE } from "../utils/nutrition";
import { filterMeals, getMealById } from "../utils/planner";

function MealDetail() {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const meal = getMealById(mealId);

  if (!meal) {
    return (
      <div className="page">
        <p>Meal not found.</p>
        <Link to="/meals">← Back to all meals</Link>
      </div>
    );
  }

  const containsLabels = meal.contains.map((c) => AVOIDABLE.find((a) => a.value === c)?.label || c);
  const fitsDiet = filterMeals(profile, [meal]).length === 1;

  return (
    <div className="page page-narrow">
      <button className="link-button" onClick={() => navigate(-1)}>← Back</button>
      <article className="panel meal-detail">
        <img src={meal.image} alt={meal.name} />
        <div className="meal-detail-body">
          <div className="meal-detail-head">
            <span className="plan-badge">{meal.mealType}</span>
            <FavouriteButton mealId={meal.id} />
          </div>
          <h1>{meal.name}</h1>
          <p>{meal.instructions}</p>

          <h3>Nutrition (standard portion)</h3>
          <ul className="macro-list">
            <li>Calories: {meal.calories}</li>
            <li>Carbs: {meal.carbohydrate}g</li>
            <li>Protein: {meal.protein}g</li>
            <li>Fat: {meal.fat}g</li>
          </ul>

          <h3>Ingredients</h3>
          <ul className="ingredient-list">
            {meal.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>

          <h3>Dietary info</h3>
          <p>
            {meal.vegetarian ? "Vegetarian. " : ""}
            {containsLabels.length ? `Contains: ${containsLabels.join(", ")}.` : "No common allergens listed."}
          </p>
          {user && !fitsDiet && (
            <p className="warning-text">⚠ This meal doesn't match your diet preferences.</p>
          )}
        </div>
      </article>
    </div>
  );
}

export default MealDetail;
