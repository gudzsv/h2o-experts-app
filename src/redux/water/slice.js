import { createSlice } from '@reduxjs/toolkit';
import {
  addWater,
  deleteWater,
  editWater,
  getDayWater,
  getMonthWater,
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
      .addCase(getDayWater.pending, handlePending)
      .addCase(getDayWater.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false;
        state.dayWater = payload.date ?? [];
        state.dayKey = meta.arg;
      })
      .addCase(getDayWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_DAY_WATER);
      })
      .addCase(getMonthWater.pending, handlePending)
      .addCase(getMonthWater.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false;
        state.monthWater = payload.date ?? [];
        state.monthKey = meta.arg;
      })
      .addCase(getMonthWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_MONTH_WATER);
      })
      .addCase(getWeekWater.pending, handlePending)
      .addCase(getWeekWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.weekWater = payload;
      })
      .addCase(getWeekWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_WEEK_WATER);
      });
  },
});

export const waterReducer = waterSlice.reducer;
