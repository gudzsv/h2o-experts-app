import { format, subDays } from 'date-fns';

const WEEK_DAYS = 7;

export const toDateKey = date => format(date, 'yyyy-MM-dd');

export const toMonthKey = date => format(date, 'yyyy-MM');

// drinkingTime is stored as a local `YYYY-MM-DDTHH:mm:ss` string.
export const getEntryDateKey = entry => entry.drinkingTime.slice(0, 10);

export const getWeekDays = (today = new Date()) =>
  Array.from({ length: WEEK_DAYS }, (_, i) =>
    subDays(today, WEEK_DAYS - 1 - i)
  );

export const getWeekRange = (today = new Date()) => {
  const days = getWeekDays(today);

  return {
    startKey: toDateKey(days[0]),
    endKey: toDateKey(days[days.length - 1]),
    monthKeys: [...new Set(days.map(toMonthKey))],
  };
};
