// Dates are stored as local "YYYY-MM-DD" keys so a day means the user's own calendar day.
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function formatDateKey(key, options = { day: "numeric", month: "short" }) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, options);
}

// Consecutive days with at least one logged meal, ending today. If nothing is logged
// yet today, the streak still counts up to yesterday so it doesn't reset each morning.
export function currentStreak(loggedKeys, today = new Date()) {
  const logged = new Set(loggedKeys);
  let day = logged.has(dateKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (logged.has(dateKey(day))) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

// Monday = 0 ... Sunday = 6, matching DAYS_OF_WEEK in planner.js.
export function weekdayIndex(date = new Date()) {
  return (date.getDay() + 6) % 7;
}
