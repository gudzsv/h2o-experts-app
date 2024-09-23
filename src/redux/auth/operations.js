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
      await API.post('/auth/register', registerData);
      const { data } = await API.post('/auth/login', registerData);
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
      const { data } = await API.post('/auth/login', loginData);
      setAuthHeader(data.data.accessToken);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await API.post('/auth/logout');
    await persistor.purge();
    clearAuthHeader();

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/refresh');
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

export const currentUser = createAsyncThunk(
  'auth/current',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      setAuthHeader(state.auth.token);
      const response = await API.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const token = getState().auth.token;
      return Boolean(token);
    },
  }
);

export const getCounter = createAsyncThunk(
  'auth/count',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/users/count');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOAuthURL = createAsyncThunk(
  'auth/getOAuthURL',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/auth/get-oauth-url');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginOAuth = createAsyncThunk(
  'auth/loginOAuth',
  async (confirmCode, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/confirm-oauth', {
        code: confirmCode,
      });
      setAuthHeader(data.data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, thunkAPI) => {
    try {
      const response = await API.post('/auth/send-reset-email', email);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPwd = createAsyncThunk(
  'auth/resetPwd',
  async (token, thunkAPI) => {
    try {
      const response = await API.post('/auth/reset-pwd', token);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
