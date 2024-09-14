import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  currentUser,
  login,
  logOut,
  refreshUser,
  editUser,
} from './operations.js';
import toast from 'react-hot-toast';

const initialState = {
  user: {
    id: null,
    name: null,
    email: null,
    weight: null,
    activityLevel: null,
    gender: 'female',
    dailyRequirement: 2000,
    photo: null,
  },
  token: null,
  isLoading: false,
  isLoggedIn: false,
  isRefreshing: false,
};

const handlePending = state => {
  state.isLoading = true;
};

const handleError = payload => {
  // Add selection of errors
  toast.error(payload);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoggedIn = false;
        handleError(payload);
      })

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.data.user;
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoggedIn = false;
        handleError(payload);
      })
      .addCase(logOut.fulfilled, state => {
        state.user = {
          name: null,
          email: null,
        };
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logOut.rejected, (state, { payload }) => {
        state.isLoggedIn = false;
        handleError(payload);
      })
      .addCase(currentUser.pending, handlePending)
      .addCase(currentUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
      })
      .addCase(currentUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        handleError(payload);
      })
      .addCase(editUser.pending, handlePending)
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
      })
      .addCase(editUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        handleError(payload);
      })

      .addCase(refreshUser.pending, state => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state, { payload }) => {
        state.isRefreshing = false;
        state.token = null;
        handleError(payload);
      });
  },
});

export const authReducer = authSlice.reducer;
