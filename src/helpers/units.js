import { QUICK_AMOUNTS } from '../constants/constants.js';

// Water is always stored in milliliters; units only affect what the user
// sees and types.
export const UNITS = { ML: 'ml', OZ: 'oz' };

const ML_PER_OZ = 29.5735; // US fluid ounce
const MAX_AMOUNT_ML = 9999;

export const normalizeUnits = units =>
  units === UNITS.OZ ? UNITS.OZ : UNITS.ML;

const isOz = units => normalizeUnits(units) === UNITS.OZ;

export const mlToOz = ml => ml / ML_PER_OZ;

export const ozToMl = oz => Math.round(oz * ML_PER_OZ);

// Whole numbers, as typed into the water form.
export const toDisplayAmount = (ml, units) =>
  isOz(units) ? Math.round(mlToOz(ml)) : ml;

export const fromDisplayAmount = (value, units) =>
  isOz(units) ? ozToMl(value) : Math.round(value);

// One decimal for oz, used where values are only shown (chart).
export const toDisplayDecimal = (ml, units) =>
  isOz(units) ? Number(mlToOz(ml).toFixed(1)) : ml;

export const getStep = units => (isOz(units) ? 1 : 50);

export const getDefaultAmount = units => (isOz(units) ? 2 : 50);

export const getMaxAmount = units =>
  isOz(units) ? Math.floor(mlToOz(MAX_AMOUNT_ML)) : MAX_AMOUNT_ML;

export const getQuickAmounts = units => QUICK_AMOUNTS[normalizeUnits(units)];

// An entry: "250 ml", "1.5 L" or "8.5 oz".
export const formatVolume = (ml, units, labels) => {
  if (isOz(units)) {
    return `${Number(mlToOz(ml).toFixed(1))} ${labels.oz}`;
  }

  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} ${labels.l}`;
  }

  return `${ml} ${labels.ml}`;
};

// The daily norm: "2 L" or "68 oz".
export const formatDailyNorm = (ml, units, labels) =>
  isOz(units)
    ? `${Math.round(mlToOz(ml))} ${labels.oz}`
    : `${ml / 1000} ${labels.l}`;
