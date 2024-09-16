import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios';

export const addWater = createAsyncThunk(
  'water/add',
  async (addData, thunkAPI) => {
    try {
      const { data } = await API.post('/water', addData);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const editWater = createAsyncThunk(
  'water/edit',
  async ({ waterId, ...editData }, thunkAPI) => {
    try {
      const { data } = await API.patch(`/water/:${waterId}`, { ...editData });
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteWater = createAsyncThunk(
  'water/delete',
  async (waterId, thunkAPI) => {
    try {
      const { data } = await API.delete(`/water/:${waterId}`);
      return { data, waterId };
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const getDayWater = createAsyncThunk(
  'water/getDay',
  async (date, thunkAPI) => {
    try {
      const { data } = await API.get(`/water/day/:${date}`);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const getMonthWater = createAsyncThunk(
  'water/getMonth',
  async (yearMonth, thunkAPI) => {
    try {
      const { data } = await API.get(`/water/month/:${yearMonth}`);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
