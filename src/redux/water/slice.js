import { createSlice } from '@reduxjs/toolkit';
import {
  addWater,
  deleteWater,
  editWater,
  getDayWater,
  getMonthWater,
  getStats,
  getWeekWater,
} from './operations';
import toast from 'react-hot-toast';
import i18n from '../../i18n/i18n.js';
import { MESSAGES } from '../../constants/constants.js';
import { createDate } from '../../helpers/createDateMessage';
import { getEntryDateKey, getWeekRange } from '../../helpers/date.js';

const { SUCCESS, ERROR } = MESSAGES;

const initialState = {
  dayWater: [],
  dayKey: null,
  monthWater: [],
  monthKey: null,
  weekWater: [],
  isLoading: false,
  // The read in flight for each list, as { requestId, arg }. On a slow server
  // a response can arrive after a newer read or after a write, so only the
  // latest read may replace a list (see refreshReadsInFlight in operations).
  reads: { day: null, month: null, week: null },
  // The stats page shows its error inline, so it does not share `isLoading`
  // and the toasts with the tracker. Loading is `stats === null`.
  stats: null,
  isStatsFailed: false,
};

const handlePending = state => {
  state.isLoading = true;
};

const handleMessage = message => {
  toast.success(i18n.t(message), { id: message });
};

const handleError = message => {
  toast.error(i18n.t(message), { id: message });
};

const startRead = key => (state, { meta }) => {
  state.isLoading = true;
  state.reads[key] = { requestId: meta.requestId, arg: meta.arg };
};

// True, and the read is cleared, when this response belongs to the latest
// read of the list; an older response must not overwrite newer data.
const finishRead = (state, key, meta) => {
  if (state.reads[key]?.requestId !== meta.requestId) {
    return false;
  }

  state.reads[key] = null;
  state.isLoading = false;
  return true;
};

const removeEntry = (state, id) => {
  state.dayWater = state.dayWater.filter(entry => entry._id !== id);
  state.monthWater = state.monthWater.filter(entry => entry._id !== id);
  state.weekWater = state.weekWater.filter(entry => entry._id !== id);
};

const upsertEntry = (state, entry) => {
  removeEntry(state, entry._id);

  const dateKey = getEntryDateKey(entry);
  const { startKey, endKey } = getWeekRange();

  if (dateKey === state.dayKey) {
    state.dayWater.push(entry);
  }
  if (dateKey.slice(0, 7) === state.monthKey) {
    state.monthWater.push(entry);
  }
  if (dateKey >= startKey && dateKey <= endKey) {
    state.weekWater.push(entry);
  }
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(addWater.pending, handlePending)
      .addCase(addWater.fulfilled, (state, { payload }) => {
        upsertEntry(state, payload.data);
        state.isLoading = false;
        toast.success(createDate(payload, i18n.t(SUCCESS.ADD_WATER)), {
          id: SUCCESS.ADD_WATER,
        });
      })
      .addCase(addWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.ADD_WATER);
      })
      .addCase(editWater.pending, handlePending)
      .addCase(editWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        upsertEntry(state, payload.data);
        handleMessage(SUCCESS.EDIT_WATER);
      })
      .addCase(editWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.EDIT_WATER);
      })
      .addCase(deleteWater.pending, handlePending)
      .addCase(deleteWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        removeEntry(state, payload.waterId);
        handleMessage(SUCCESS.DELETE_WATER);
      })
      .addCase(deleteWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.DELETE_WATER);
      })
      .addCase(getDayWater.pending, startRead('day'))
      .addCase(getDayWater.fulfilled, (state, { payload, meta }) => {
        if (finishRead(state, 'day', meta)) {
          state.dayWater = payload.date ?? [];
          state.dayKey = meta.arg;
        }
      })
      .addCase(getDayWater.rejected, (state, { meta }) => {
        if (finishRead(state, 'day', meta)) {
          handleError(ERROR.GET_DAY_WATER);
        }
      })
      .addCase(getMonthWater.pending, startRead('month'))
      .addCase(getMonthWater.fulfilled, (state, { payload, meta }) => {
        if (finishRead(state, 'month', meta)) {
          state.monthWater = payload.date ?? [];
          state.monthKey = meta.arg;
        }
      })
      .addCase(getMonthWater.rejected, (state, { meta }) => {
        if (finishRead(state, 'month', meta)) {
          handleError(ERROR.GET_MONTH_WATER);
        }
      })
      .addCase(getWeekWater.pending, startRead('week'))
      .addCase(getWeekWater.fulfilled, (state, { payload, meta }) => {
        if (finishRead(state, 'week', meta)) {
          state.weekWater = payload;
        }
      })
      .addCase(getWeekWater.rejected, (state, { meta }) => {
        if (finishRead(state, 'week', meta)) {
          handleError(ERROR.GET_WEEK_WATER);
        }
      })
      .addCase(getStats.pending, state => {
        state.isStatsFailed = false;
      })
      .addCase(getStats.fulfilled, (state, { payload }) => {
        state.stats = payload;
      })
      .addCase(getStats.rejected, state => {
        state.isStatsFailed = true;
      });
  },
});

export const waterReducer = waterSlice.reducer;
