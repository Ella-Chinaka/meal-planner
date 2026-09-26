import React from "react";
import MealCard from "./MealCard";
import ShoppingList from "./ShoppingList";
import { computePlan, planIngredients } from "../utils/planner";

const SLOT_LABELS = ["Breakfast", "Lunch", "Dinner"];

function Totals({ title, totals }) {
  return (
    <>
      <h3>{title}</h3>
      <ul className="macro-list">
        <li>Calories: {totals.calories}</li>
        <li>Carbs: {totals.carbohydrate}g</li>
        <li>Protein: {totals.protein}g</li>
        <li>Fat: {totals.fat}g</li>
      </ul>
    </>
  );
}

// Renders a stored plan (meal ids only) with scaled portions, totals and a shopping list.
function PlanView({ plan, onSwap, onToggleItem, swapping, shoppingNote }) {
  const computed = computePlan(plan);
  const weekly = plan.type === "weekly";

  return (
    <div className="plan-view">
      <h4 className="plan-title">{weekly ? "7-Day Meal Plan" : "Daily Meal Plan"}</h4>
      <p className="plan-subtitle">Target: {plan.calorieTarget} kcal per day</p>

      {computed.days.map((day, dayIndex) => (
        <div key={dayIndex} className="day-plan">
          {weekly && <h5>{day.label}</h5>}
          <div className="meal-grid">
            {day.meals.map((meal, slot) => (
              <MealCard
                key={slot}
                meal={meal}
                label={SLOT_LABELS[slot]}
                swapping={swapping}
                onSwap={onSwap ? () => onSwap(dayIndex, slot) : undefined}
              />
            ))}
          </div>
          <Totals title="Daily Totals" totals={day.totals} />
        </div>
      ))}

      {weekly && <Totals title="Weekly Totals" totals={computed.totals} />}

      <ShoppingList
        items={planIngredients(plan)}
        checked={plan.checked || []}
        onToggle={onToggleItem}
        note={shoppingNote}
      />
    </div>
  );
}

export default PlanView;
