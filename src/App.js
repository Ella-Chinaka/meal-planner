import React, { useState, useRef } from "react";
import meals from "./meals";
import "./index.css";
import DailyPlan from "./dailyplan";
import WeeklyPlan from "./weeklyplan";

function App() {
  const [calories, setCalories] = useState("");
  const [plan, setPlan] = useState(null);
  const [weekPlan, setWeekPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [activeView, setActiveView] = useState("");
  const [weekTotals, setWeekTotals] = useState(null);

  const planRef = useRef(null);

  const getRandomMeal = (type) => {
    const options = meals.filter((m) => m.mealType === type);
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateDayPlan = () => {
    const breakfast = getRandomMeal("breakfast");
    const lunch = getRandomMeal("lunch");
    const dinner = getRandomMeal("dinner");
    return [breakfast, lunch, dinner];
  };

  const generateWeekPlan = () => {
    let days = [];
    let allIngredients = {};
    let weeklyTotals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0 };
    const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    for (let i = 0; i < 7; i++) {
      const dayMeals = generateDayPlan();
      const dayTotals = {
        calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
        carbohydrate: dayMeals.reduce((sum, m) => sum + m.carbohydrate, 0),
        fat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
      };

      weeklyTotals.calories += dayTotals.calories;
      weeklyTotals.protein += dayTotals.protein;
      weeklyTotals.carbohydrate += dayTotals.carbohydrate;
      weeklyTotals.fat += dayTotals.fat;

      days.push({
        day: daysOfWeek[i],
        meals: dayMeals,
        totals: dayTotals,
      });

      dayMeals.forEach((meal) => {
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach((ing) => {
            allIngredients[ing] = (allIngredients[ing] || 0) + 1;
          });
        }
      });
    }

    setWeekPlan(days);
    setShoppingList(Object.keys(allIngredients));
    setPlan(null);
    setActiveView("weekly");
    setWeekTotals(weeklyTotals);
    planRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generatePlan = () => {
    if (!calories || calories < 1200) {
      alert("Please enter a valid calorie target (minimum 1200).");
      return;
    }

    const [breakfast, lunch, dinner] = generateDayPlan();
    const baseCalories = breakfast.calories + lunch.calories + dinner.calories;
    const scale = calories / baseCalories;

    setPlan({
      breakfast: {
        ...breakfast,
        calories: Math.round(breakfast.calories * scale),
        carbohydrate: Math.round(breakfast.carbohydrate * scale),
        protein: Math.round(breakfast.protein * scale),
        fat: Math.round(breakfast.fat * scale),
      },
      lunch: {
        ...lunch,
        calories: Math.round(lunch.calories * scale),
        carbohydrate: Math.round(lunch.carbohydrate * scale),
        protein: Math.round(lunch.protein * scale),
        fat: Math.round(lunch.fat * scale),
      },
      dinner: {
        ...dinner,
        calories: Math.round(dinner.calories * scale),
        carbohydrate: Math.round(dinner.carbohydrate * scale),
        protein: Math.round(dinner.protein * scale),
        fat: Math.round(dinner.fat * scale),
      },
      totalCalories: Math.round(baseCalories * scale),
      totalCarbohydrate: Math.round(
        (breakfast.carbohydrate + lunch.carbohydrate + dinner.carbohydrate) * scale
      ),
      totalProtein: Math.round(
        (breakfast.protein + lunch.protein + dinner.protein) * scale
      ),
      totalFat: Math.round(
        (breakfast.fat + lunch.fat + dinner.fat) * scale
      ),
    });

    setWeekPlan(null);
    setActiveView("daily");
    planRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      {/* Hero Section always visible */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Quick Diet</h1>
          <p className="hero-tagline">
            Eat smart, stay healthy, and save time with personalized Nigerian meal plans.
          </p>
          <div className="input-section">
            <input
              type="number"
              placeholder="Enter daily calorie target"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            <button onClick={generatePlan}>Generate Daily Plan</button>
            <button onClick={generateWeekPlan}>Generate 7-Day Plan</button>
          </div>
        </div>
      </div>

      {/*  Homepage Sections only show if no plan is generated */}
      {!activeView && (
        <>
          {/* About Section */}
          <section className="about-section">
            <img src="/images/about-us.jpg" alt="About Quick Diet" />
            <div>
              <h2>About Quick Diet</h2>
              <p>
                Quick Diet is more than just a meal planner, it is your everyday nutrition partner. 
                By combining technology with local Nigerian delicacies, it ensures that your health goals 
                align with meals you actually enjoy. Instead of struggling with foreign diets that don’t fit 
                your lifestyle, Quick Diet creates practical, affordable, and balanced plans tailored to you. 
                With calorie based scaling, you never have to guess portions again. Plus, the automatic weekly 
                shopping list saves time, reduces food waste, and helps you stick to your budget.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <h2>Why Choose Quick Diet?</h2>
            <div className="card-grid">
              <div className="card">
                <img src="/images/personalizedmealplan.jpg" alt="Personalized Plans" />
                <h3>Personalized Plans</h3>
                <p>
                  Enter your calorie target and instantly receive meal plans designed to match your goals. 
                  From hearty Nigerian breakfasts to balanced lunches and wholesome dinners, every plan is 
                  crafted to help you feel energized and satisfied without unnecessary stress.
                </p>
              </div>
              <div className="card">
                <img src="/images/shopping-list.jpg" alt="Shopping List" />
                <h3>Automatic Shopping List</h3>
                <p>
                  No more standing in the market confused about what to buy. Quick Diet automatically compiles 
                  your week’s ingredients into a single, simple shopping list. You’ll know exactly what to purchase, 
                  saving both time and money while making meal prep stress free.
                </p>
              </div>
              <div className="card">
                <img src="/images/track-fitness.jpg" alt="Track Calories" />
                <h3>Stay on Track</h3>
                <p>
                  Track your daily and weekly nutrition without complicated spreadsheets or guesswork. 
                  Quick Diet calculates calories, proteins, carbohydrates, and fats automatically, helping 
                  you stay consistent, avoid overeating, and hit your fitness or wellness milestones faster.
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="testimonials-section">
            <h2>What Our Users Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Elina" />
                <p>“Quick Diet has made eating healthy so much easier for me. I love that I can still enjoy my favorite Nigerian meals while hitting my goals.”</p>
                <h4>- Elina, Student</h4>
              </div>
              <div className="testimonial">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Howard" />
                <p>“The weekly shopping list is a total game changer. I save hours every weekend and I’m never confused in the market anymore.”</p>
                <h4>- Howard, Banker</h4>
              </div>
              <div className="testimonial">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Kiley" />
                <p>“I’ve finally achieved my weight loss goals just by following the plans. Quick Diet keeps me consistent and motivated.”</p>
                <h4>- Kiley, Entrepreneur</h4>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Main Content - shows daily or weekly plan */}
      <div className="main-content" ref={planRef}>
        {activeView === "daily" && plan && <DailyPlan plan={plan} />}
        {activeView === "weekly" && weekPlan && (
          <WeeklyPlan 
            weekPlan={weekPlan} 
            shoppingList={shoppingList} 
            weekTotals={weekTotals} 
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-6 text-center mt-12">
        <p>© {new Date().getFullYear()} Quick Diet. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
