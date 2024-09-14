import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios';
import { persistor } from '../store';

const setAuthHeader = token => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  API.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (registerData, thunkAPI) => {
    try {
      await API.post('/users/register', registerData);
      const { data } = await API.post('/users/login', registerData);
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (loginData, thunkAPI) => {
    try {
      const { data } = await API.post('/users/login', loginData);
      setAuthHeader(data.data.accessToken);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await API.post('/users/logout');
    await persistor.purge();
    clearAuthHeader();

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const currentUser = createAsyncThunk(
  'auth/current',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/users');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editUser = createAsyncThunk(
  'auth/edit',
  async (editData, thunkAPI) => {
    try {
      const { data } = await API.patch('/users', editData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/users/refresh');
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();
      if (!auth.token) {
        return false;
      }
    },
  }
);
