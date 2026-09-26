import meals from "../meals";
import {
  computeDay,
  computePlan,
  filterMeals,
  generatePlan,
  getMealById,
  mealPools,
  swapMeal,
} from "./planner";
import { calculateCalorieTarget } from "./nutrition";
import { categorize, groupItems } from "./shopping";
import { currentStreak, dateKey, addDays } from "./dates";

test("every meal has a unique id", () => {
  const ids = meals.map((m) => m.id);
  expect(new Set(ids).size).toBe(ids.length);
});

describe("filterMeals", () => {
  test("vegetarian excludes meat and fish", () => {
    const result = filterMeals({ diet: "vegetarian" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.vegetarian)).toBe(true);
  });

  test("pescatarian keeps fish but drops meat", () => {
    const result = filterMeals({ diet: "pescatarian" });
    expect(result.some((m) => m.contains.includes("fish"))).toBe(true);
    expect(result.some((m) => m.contains.includes("beef") || m.contains.includes("chicken"))).toBe(false);
  });

  test("avoid list removes matching meals", () => {
    const result = filterMeals({ avoid: ["gluten", "egg"] });
    expect(result.some((m) => m.contains.includes("gluten") || m.contains.includes("egg"))).toBe(false);
  });

  test("handles a missing profile", () => {
    expect(filterMeals(null)).toHaveLength(meals.length);
  });
});

describe("generatePlan", () => {
  test("weekly plan scales every day to the calorie target", () => {
    const plan = computePlan(generatePlan({ type: "weekly", calorieTarget: 2000, prefs: {} }));
    expect(plan.days).toHaveLength(7);
    plan.days.forEach((day) => {
      expect(Math.abs(day.totals.calories - 2000)).toBeLessThanOrEqual(3);
    });
  });

  test("weekly plan does not serve the same meal two days in a row", () => {
    for (let run = 0; run < 50; run++) {
      const plan = generatePlan({ type: "weekly", calorieTarget: 2000, prefs: {} });
      for (let d = 1; d < 7; d++) {
        for (let slot = 0; slot < 3; slot++) {
          expect(plan.days[d].mealIds[slot]).not.toBe(plan.days[d - 1].mealIds[slot]);
        }
      }
    }
  });

  test("weekly plan avoids repeats when enough options exist", () => {
    const plan = generatePlan({ type: "weekly", calorieTarget: 2000, prefs: {} });
    const breakfasts = plan.days.map((d) => d.mealIds[0]);
    expect(new Set(breakfasts).size).toBe(7); // 10 breakfast options available
  });

  test("respects preferences", () => {
    const plan = generatePlan({ type: "weekly", calorieTarget: 2000, prefs: { diet: "vegetarian" } });
    plan.days.flatMap((d) => d.mealIds).forEach((id) => expect(getMealById(id).vegetarian).toBe(true));
  });

  test("strict preferences still produce a full plan", () => {
    const strict = {
      diet: "vegetarian",
      avoid: ["gluten", "egg", "dairy", "fish", "shellfish", "beef", "chicken"],
    };
    expect(() => generatePlan({ type: "weekly", calorieTarget: 2000, prefs: strict })).not.toThrow();
  });

  test("throws a readable error when preferences rule out a meal type", () => {
    const noVegLunch = meals.filter((m) => m.mealType !== "lunch" || !m.vegetarian);
    expect(() => mealPools({ diet: "vegetarian" }, noVegLunch)).toThrow(/every lunch option/);
  });
});

describe("swapMeal", () => {
  test("replaces only the chosen meal with another of the same type", () => {
    const plan = generatePlan({ type: "daily", calorieTarget: 1800, prefs: {} });
    const swapped = swapMeal(plan, 0, 1, {});
    expect(swapped.days[0].mealIds[0]).toBe(plan.days[0].mealIds[0]);
    expect(swapped.days[0].mealIds[2]).toBe(plan.days[0].mealIds[2]);
    expect(swapped.days[0].mealIds[1]).not.toBe(plan.days[0].mealIds[1]);
    expect(getMealById(swapped.days[0].mealIds[1]).mealType).toBe("lunch");
  });

  test("swapped day still hits the calorie target", () => {
    const plan = swapMeal(generatePlan({ type: "daily", calorieTarget: 1800, prefs: {} }), 0, 2, {});
    expect(Math.abs(computeDay(plan.days[0], 1800).totals.calories - 1800)).toBeLessThanOrEqual(3);
  });
});

test("calorie target uses Mifflin-St Jeor with activity and goal", () => {
  // 30yo female, 165cm, 70kg: BMR = 700 + 1031.25 - 150 - 161 = 1420.25
  const maintain = calculateCalorieTarget({
    age: 30, gender: "female", height: 165, weight: 70, activity: "moderate", goal: "maintain",
  });
  expect(maintain).toBe(2200); // 1420.25 * 1.55 = 2201 -> 2200
  const lose = calculateCalorieTarget({
    age: 30, gender: "female", height: 165, weight: 70, activity: "sedentary", goal: "lose",
  });
  expect(lose).toBe(1200); // 1704 - 500 = 1204 -> 1200 (floor)
});

test("shopping list categories", () => {
  expect(categorize("Vegetable oil")).toBe("Oils & Seasonings");
  expect(categorize("Chicken stock")).toBe("Oils & Seasonings");
  expect(categorize("Stockfish")).toBe("Proteins & Dairy");
  expect(categorize("Mixed vegetables")).toBe("Vegetables");
  expect(categorize("Yam")).toBe("Grains & Staples");
  expect(groupItems(["Onion", "Rice", "Tea"]).map((g) => g.category)).toEqual([
    "Grains & Staples",
    "Vegetables",
    "Other",
  ]);
});

test("streak counts consecutive logged days", () => {
  const today = new Date(2026, 8, 25);
  const days = (n) => dateKey(addDays(today, -n));
  expect(currentStreak([days(0), days(1), days(2), days(4)], today)).toBe(3);
  // Nothing logged yet today: streak up to yesterday still counts
  expect(currentStreak([days(1), days(2)], today)).toBe(2);
  expect(currentStreak([days(2)], today)).toBe(0);
});
