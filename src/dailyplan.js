import React from "react";

function DailyPlan({ plan }) {
  return (
    <div className="meal-plan">
      <h4>Meal Plan</h4>
      <div className="daily-meal-container">
        {[
          { label: "Breakfast", data: plan.breakfast },
          { label: "Lunch", data: plan.lunch },
          { label: "Dinner", data: plan.dinner },
        ].map((meal, i) => (
          <div className="daily-meal" key={i}>
            <h2>{meal.label}</h2>
            <h3>{meal.data.name}</h3>
            <img src={meal.data.image} alt={meal.data.name} />
            <p>{meal.data.instructions}</p>
            <ul>
              <li>Calories: {meal.data.calories}</li>
              <li>Carbs: {meal.data.carbohydrate}g</li>
              <li>Protein: {meal.data.protein}g</li>
              <li>Fat: {meal.data.fat}g</li>
            </ul>
          </div>
        ))}
      </div>

      <h3>Daily Totals</h3>
      <ul>
        <li>Calories: {plan.totalCalories}</li>
        <li>Carbohydrate: {plan.totalCarbohydrate}g</li>
        <li>Protein: {plan.totalProtein}g</li>
        <li>Fat: {plan.totalFat}g</li>
      </ul>
    </div>
  );
}

export default DailyPlan;
