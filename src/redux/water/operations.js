import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios';
import { toRejectValue } from '../../helpers/errors';
import { getWeekRange, toDateKey } from '../../helpers/date';

// A read that started before a write finished returns data without that
// write, so it is requested again; the slice ignores the older response.
const refreshReadsInFlight = ({ dispatch, getState }) => {
  const { reads } = getState().water;

  if (reads.day) {
    dispatch(getDayWater(reads.day.arg));
  }
  if (reads.month) {
    dispatch(getMonthWater(reads.month.arg));
  }
  if (reads.week) {
    dispatch(getWeekWater());
  }
};

export const addWater = createAsyncThunk(
  'water/add',
  async (addData, thunkAPI) => {
    try {
      const { data } = await API.post('/water', addData);
      refreshReadsInFlight(thunkAPI);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

export const editWater = createAsyncThunk(
  'water/edit',
  async ({ waterId, ...editData }, thunkAPI) => {
    try {
      const { data } = await API.patch(`/water/${waterId}`, { ...editData });
      refreshReadsInFlight(thunkAPI);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

export const deleteWater = createAsyncThunk(
  'water/delete',
  async (waterId, thunkAPI) => {
    try {
      const { data } = await API.delete(`/water/${waterId}`);
      refreshReadsInFlight(thunkAPI);
      return { data, waterId };
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

export const getDayWater = createAsyncThunk(
  'water/getDay',
  async (date, thunkAPI) => {
    try {
      const { data } = await API.get(`/water/day/${date}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

export const getMonthWater = createAsyncThunk(
  'water/getMonth',
  async (yearMonth, thunkAPI) => {
    try {
      const { data } = await API.get(`/water/month/${yearMonth}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

export const getWeekWater = createAsyncThunk(
  'water/getWeek',
  async (_, thunkAPI) => {
    try {
      const { monthKeys } = getWeekRange();
      const responses = await Promise.all(
        monthKeys.map(monthKey => API.get(`/water/month/${monthKey}`))
      );
      return responses.flatMap(({ data }) => data.date);
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);

// The server cannot know the user's time zone, so the local date goes along.
export const getStats = createAsyncThunk(
  'water/getStats',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/water/stats', {
        params: { today: toDateKey(new Date()) },
      });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRejectValue(error));
    }
  }
);
