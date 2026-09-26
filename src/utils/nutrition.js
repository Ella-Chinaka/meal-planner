export const MIN_CALORIES = 1200;

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)", factor: 1.2 },
  { value: "light", label: "Lightly active (1-3 days/week)", factor: 1.375 },
  { value: "moderate", label: "Moderately active (3-5 days/week)", factor: 1.55 },
  { value: "active", label: "Very active (6-7 days/week)", factor: 1.725 },
  { value: "extra", label: "Extra active (physical job or training twice a day)", factor: 1.9 },
];

export const GOALS = [
  { value: "lose", label: "Lose weight", adjustment: -500 },
  { value: "maintain", label: "Maintain weight", adjustment: 0 },
  { value: "gain", label: "Gain weight", adjustment: 300 },
];

export const DIETS = [
  { value: "none", label: "No restriction" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "pescatarian", label: "Pescatarian (fish, no meat)" },
];

// Things a meal can contain (see `contains` in meals.js) that a user may want to avoid.
export const AVOIDABLE = [
  { value: "beef", label: "Beef" },
  { value: "chicken", label: "Chicken" },
  { value: "pork", label: "Pork" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish (crayfish)" },
  { value: "egg", label: "Egg" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten (wheat)" },
  { value: "peanut", label: "Peanut" },
];

export function isProfileComplete(profile) {
  return Boolean(
    profile &&
      profile.age &&
      profile.gender &&
      profile.height &&
      profile.weight &&
      profile.activity &&
      profile.goal
  );
}

// Mifflin-St Jeor BMR x activity factor, adjusted for the goal. Never below MIN_CALORIES.
export function calculateCalorieTarget({ age, gender, height, weight, activity, goal }) {
  const a = Number(age);
  const h = Number(height);
  const w = Number(weight);
  if (!a || !h || !w || !gender || !activity || !goal) return null;

  const bmr = 10 * w + 6.25 * h - 5 * a + (gender === "male" ? 5 : -161);
  const factor = ACTIVITY_LEVELS.find((l) => l.value === activity)?.factor ?? 1.2;
  const adjustment = GOALS.find((g) => g.value === goal)?.adjustment ?? 0;
  const target = Math.round((bmr * factor + adjustment) / 10) * 10;
  return Math.max(MIN_CALORIES, target);
}
