// Recommended water per day in liters, from the formulas shown in the
// settings: V = M * 0.03 + T * 0.4 for women and V = M * 0.04 + T * 0.6 for
// men (M is the weight in kg, T the hours of active sport).
const COEFFICIENTS = {
  female: { weight: 0.03, activity: 0.4 },
  male: { weight: 0.04, activity: 0.6 },
};

// Returns null when the gender is unknown or an input is not a number.
export const calculateDailyNormLiters = (gender, weightKg, activityHours) => {
  const coefficients = COEFFICIENTS[gender];

  if (!coefficients) {
    return null;
  }

  const liters =
    Number(weightKg) * coefficients.weight +
    Number(activityHours) * coefficients.activity;

  return Number.isFinite(liters) ? liters : null;
};
