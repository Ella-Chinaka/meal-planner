import React, { useState } from "react";

function WeeklyPlan({ weekPlan, shoppingList, weekTotals }) {
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Ensure unique items
  const uniqueShoppingList = Array.from(new Set(shoppingList));

  return (
    <div className="week-plan">
      <h4>7-Day Meal Plan</h4>
      {weekPlan.map((day, index) => (
        <div key={index} className="day-plan">
          <h5>{day.day}</h5>
          <div className="weekly-meal-container">
            {day.meals.map((meal, i) => (
              <div className="weekly-meal" key={i}>
                <h2>{i === 0 ? "Breakfast" : i === 1 ? "Lunch" : "Dinner"}</h2>
                <h3>{meal.name}</h3>
                <img src={meal.image} alt={meal.name} />
                <p>{meal.instructions}</p>
                <ul>
                  <li>Calories: {meal.calories}</li>
                  <li>Carbs: {meal.carbohydrate}g</li>
                  <li>Protein: {meal.protein}g</li>
                  <li>Fat: {meal.fat}g</li>
                </ul>
              </div>
            ))}
          </div>

          {/* Daily totals */}
          <h3>Daily Totals</h3>
          <ul>
            <li>Calories: {day.totals.calories}</li>
            <li>Carbs: {day.totals.carbohydrate}g</li>
            <li>Protein: {day.totals.protein}g</li>
            <li>Fat: {day.totals.fat}g</li>
          </ul>
        </div>
      ))}

      {/* Weekly totals */}
      {weekTotals && (
        <>
          <h3>Weekly Totals</h3>
          <ul>
            <li>Calories: {weekTotals.calories}</li>
            <li>Carbs: {weekTotals.carbohydrate}g</li>
            <li>Protein: {weekTotals.protein}g</li>
            <li>Fat: {weekTotals.fat}g</li>
          </ul>
        </>
      )}

      {/* Button to toggle shopping list */}
      <button
        className="btn-shopping-list"
        onClick={() => setShowShoppingList(!showShoppingList)}
      >
        {showShoppingList ? "Hide Shopping List" : "View Shopping List"}
      </button>

      {/*Shopping list hero style at the bottom */}
      {showShoppingList && (
        <div className="shopping-hero">
          <h2>Your Shopping List</h2>
          <ul>
            {uniqueShoppingList.map((item, i) => (
              <li key={i}>
                <span>✔</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeeklyPlan;
