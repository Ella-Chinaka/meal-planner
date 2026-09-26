import allMeals from "../meals";

export const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAT = ["beef", "chicken", "pork"];

export const getMealById = (id) => allMeals.find((m) => m.id === id);

// Meals allowed by the user's diet and "avoid" list.
export function filterMeals(prefs, meals = allMeals) {
  prefs = prefs || {};
  const avoid = new Set(prefs.avoid || []);
  if (prefs.diet === "pescatarian") MEAT.forEach((m) => avoid.add(m));

  return meals.filter((meal) => {
    if (prefs.diet === "vegetarian" && !meal.vegetarian) return false;
    return !meal.contains.some((c) => avoid.has(c));
  });
}

// Throws a readable error if a meal type has no options left after filtering.
export function mealPools(prefs, meals = allMeals) {
  const allowed = filterMeals(prefs, meals);
  const pools = {};
  MEAL_TYPES.forEach((type) => {
    pools[type] = allowed.filter((m) => m.mealType === type);
    if (pools[type].length === 0) {
      throw new Error(
        `Your diet preferences rule out every ${type} option. Loosen them on your profile page.`
      );
    }
  });
  return pools;
}

function shuffle(list, random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Deals meals from a shuffled deck so nothing repeats until every option has been used,
// and never serves the same meal two days running.
function makeDealer(pool, random) {
  let deck = [];
  let last = null;
  return () => {
    if (deck.length === 0) {
      deck = shuffle(pool, random);
      if (deck.length > 1 && deck[0].id === last) deck.push(deck.shift());
    }
    last = deck.shift().id;
    return last;
  };
}

// A plan only stores meal ids; portions and totals are derived with `computeDay`.
export function generatePlan({ type, calorieTarget, prefs, random = Math.random }) {
  const pools = mealPools(prefs);
  const dealers = MEAL_TYPES.map((t) => makeDealer(pools[t], random));
  const labels = type === "weekly" ? DAYS_OF_WEEK : ["Today"];

  return {
    type,
    calorieTarget: Number(calorieTarget),
    days: labels.map((label) => ({
      label,
      mealIds: dealers.map((deal) => deal()),
    })),
    checked: [],
  };
}

// Replace one meal with a different option of the same type, preferring meals
// not already used anywhere in the plan.
export function swapMeal(plan, dayIndex, slot, prefs, random = Math.random) {
  const type = MEAL_TYPES[slot];
  const pool = mealPools(prefs)[type];
  const current = plan.days[dayIndex].mealIds[slot];
  const used = new Set(plan.days.flatMap((d) => d.mealIds));

  let options = pool.filter((m) => !used.has(m.id));
  if (options.length === 0) options = pool.filter((m) => m.id !== current);
  if (options.length === 0) return plan;

  const next = options[Math.floor(random() * options.length)].id;
  return {
    ...plan,
    days: plan.days.map((day, i) =>
      i === dayIndex
        ? { ...day, mealIds: day.mealIds.map((id, s) => (s === slot ? next : id)) }
        : day
    ),
  };
}

const MACROS = ["calories", "carbohydrate", "protein", "fat"];

function sumMacros(items) {
  const totals = { calories: 0, carbohydrate: 0, protein: 0, fat: 0 };
  items.forEach((item) => MACROS.forEach((k) => (totals[k] += item[k])));
  return totals;
}

// Scales the day's portions so the three meals add up to the calorie target.
export function computeDay(day, calorieTarget) {
  const baseMeals = day.mealIds.map(getMealById).filter(Boolean);
  const baseCalories = baseMeals.reduce((sum, m) => sum + m.calories, 0);
  const scale = calorieTarget && baseCalories ? calorieTarget / baseCalories : 1;

  const meals = baseMeals.map((meal) => {
    const scaled = { ...meal, portion: scale };
    MACROS.forEach((k) => (scaled[k] = Math.round(meal[k] * scale)));
    return scaled;
  });

  return { ...day, meals, totals: sumMacros(meals) };
}

export function computePlan(plan) {
  const days = plan.days.map((day) => computeDay(day, plan.calorieTarget));
  return { ...plan, days, totals: sumMacros(days.map((d) => d.totals)) };
}

export function planIngredients(plan) {
  const items = new Set();
  plan.days.forEach((day) =>
    day.mealIds.forEach((id) => getMealById(id)?.ingredients.forEach((i) => items.add(i)))
  );
  return [...items];
}
