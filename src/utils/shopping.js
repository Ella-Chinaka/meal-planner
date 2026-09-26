// Keyword rules are checked in order, so "Vegetable oil" lands in oils before vegetables
// and "Chicken stock" in seasonings before proteins.
const CATEGORY_RULES = [
  [
    "Oils & Seasonings",
    ["oil", "salt", "spice", "seasoning", "locust", "sugar", "chicken stock", "palm nut"],
  ],
  [
    "Proteins & Dairy",
    ["beans", "egg", "chicken", "beef", "fish", "cow foot", "milk", "butter", "egusi", "ogbono", "ugba", "bambara"],
  ],
  [
    "Grains & Staples",
    ["rice", "yam", "bread", "pap", "garri", "semovita", "fufu", "starch", "plantain", "potato", "cassava", "custard", "maize"],
  ],
  [
    "Vegetables",
    ["onion", "tomato", "pepper", "okra", "spinach", "ugu", "leaves", "vegetable", "waterleaf"],
  ],
];

export const CATEGORY_ORDER = [...CATEGORY_RULES.map(([name]) => name), "Other"];

export function categorize(item) {
  const lower = item.toLowerCase();
  const match = CATEGORY_RULES.find(([, words]) => words.some((w) => lower.includes(w)));
  return match ? match[0] : "Other";
}

export function groupItems(items) {
  const groups = {};
  items.forEach((item) => {
    const category = categorize(item);
    (groups[category] = groups[category] || []).push(item);
  });
  return CATEGORY_ORDER.filter((c) => groups[c]).map((c) => ({
    category: c,
    items: groups[c].sort((a, b) => a.localeCompare(b)),
  }));
}

// Plain-text version for copying or sending on WhatsApp. Items already ticked are left out.
export function shoppingListText(items, checked = []) {
  const done = new Set(checked);
  const lines = ["Quick Diet shopping list"];
  groupItems(items.filter((i) => !done.has(i))).forEach(({ category, items: list }) => {
    lines.push("", `${category}:`);
    list.forEach((i) => lines.push(`- ${i}`));
  });
  return lines.join("\n");
}
