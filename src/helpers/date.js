import { format, subDays } from 'date-fns';

const WEEK_DAYS = 7;
const TIME_STEP_MINUTES = 5;

const pad = value => String(value).padStart(2, '0');

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

// The water form picks a time in 5-minute steps.
export const TIME_OPTIONS = Array.from(
  { length: (24 * 60) / TIME_STEP_MINUTES },
  (_, i) => {
    const minutes = i * TIME_STEP_MINUTES;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  }
);

// The latest option that is not after `date`, for example 14:37 -> 14:35.
export const toTimeOption = date =>
  `${pad(date.getHours())}:${pad(
    Math.floor(date.getMinutes() / TIME_STEP_MINUTES) * TIME_STEP_MINUTES
  )}`;

// HH:mm of an entry's drinkingTime.
export const getEntryTime = entry => entry.drinkingTime.slice(11, 16);

// A drinkingTime string for a day key and an HH:mm time.
export const toDrinkingTime = (dateKey, time) =>
  `${dateKey.slice(0, 10)}T${time}:00`;
