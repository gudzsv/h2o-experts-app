import { createSlice } from '@reduxjs/toolkit';
import {
  addWater,
  deleteWater,
  editWater,
  getDayWater,
  getMonthWater,
} from './operations';
import toast from 'react-hot-toast';
import { MESSAGES } from '../../constants/constants.js';
import { createDate } from '../../helpers/createDateMessage';

const { SUCCESS, ERROR } = MESSAGES;

const initialState = {
  dayWater: [],
  monthWater: [],
  isLoading: false,
};

const handlePending = state => {
  state.isLoading = true;
};

const handleMessage = message => {
  toast.success(message, { id: message });
};

const handleError = message => {
  toast.error(message, { id: message });
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(addWater.pending, handlePending)
      .addCase(addWater.fulfilled, (state, { payload }) => {
        state.dayWater.push(payload.data);
        state.isLoading = false;
        handleMessage(createDate(payload, SUCCESS.ADD_WATER));
      })
      .addCase(addWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.ADD_WATER);
      })
      .addCase(editWater.pending, handlePending)
      .addCase(editWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const index = state.dayWater.findIndex(
          elem => elem._id === payload.data._id
        );
        if (index !== -1) {
          state.dayWater.splice(index, 1, payload.data);
        }
        handleMessage(SUCCESS.EDIT_WATER);
      })
      .addCase(editWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.EDIT_WATER);
      })
      .addCase(deleteWater.pending, handlePending)
      .addCase(deleteWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.dayWater = state.dayWater.filter(
          elem => elem._id !== payload.waterId
        );
        handleMessage(SUCCESS.DELETE_WATER);
      })
      .addCase(deleteWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.DELETE_WATER);
      })
      .addCase(getDayWater.pending, handlePending)
      .addCase(getDayWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.dayWater = payload.date;
        // handleMessage(SUCCESS.GET_DAY_WATER);
      })
      .addCase(getDayWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_DAY_WATER);
      })
      .addCase(getMonthWater.pending, handlePending)
      .addCase(getMonthWater.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.monthWater = payload.date;
        // handleMessage(SUCCESS.GET_MONTH_WATER);
      })
      .addCase(getMonthWater.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_MONTH_WATER);
      });
  },
});

export const waterReducer = waterSlice.reducer;
