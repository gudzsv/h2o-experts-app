import { createSelector } from '@reduxjs/toolkit';
import { getEntryDateKey, toDateKey } from '../../helpers/date.js';

export const selectDayWater = state => state.water.dayWater;
export const selectMonthWater = state => state.water.monthWater;
export const selectWeekWater = state => state.water.weekWater;
export const selectIsLoading = state => state.water.isLoading;
export const selectStats = state => state.water.stats;
export const selectIsStatsFailed = state => state.water.isStatsFailed;

export const selectTodayWater = createSelector([selectWeekWater], weekWater => {
  const todayKey = toDateKey(new Date());
  return weekWater.filter(entry => getEntryDateKey(entry) === todayKey);
});
