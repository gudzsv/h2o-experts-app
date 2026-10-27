import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios';
import { toRejectValue } from '../../helpers/errors';
import { getWeekRange } from '../../helpers/date';

export const addWater = createAsyncThunk(
  'water/add',
  async (addData, thunkAPI) => {
    try {
      const { data } = await API.post('/water', addData);
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
