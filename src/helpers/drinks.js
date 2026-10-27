// Kinds of drinks and the share of each that counts toward the daily goal.
// The server keeps the same table (src/utils/drinks.js) and stores the
// counted ml as `hydration`; this copy only previews it in the form.
export const DRINK_COEFFICIENTS = {
  water: 1,
  tea: 0.9,
  milk: 0.9,
  coffee: 0.8,
  juice: 0.8,
  soda: 0.7,
};

export const DRINK_TYPES = Object.keys(DRINK_COEFFICIENTS);

export const DEFAULT_DRINK = 'water';

export const getDrinkType = entry =>
  DRINK_TYPES.includes(entry?.drinkType) ? entry.drinkType : DEFAULT_DRINK;

export const countHydration = (ml, drinkType = DEFAULT_DRINK) =>
  Math.round(ml * (DRINK_COEFFICIENTS[drinkType] ?? 1));

// Ml of an entry that count toward the goal. Entries saved before drink types
// (or by a server without them) have no `hydration` and count as water.
export const getCountedMl = entry =>
  entry?.hydration ?? entry?.usedWater ?? 0;

export const sumCountedMl = entries =>
  entries.reduce((total, entry) => total + getCountedMl(entry), 0);
