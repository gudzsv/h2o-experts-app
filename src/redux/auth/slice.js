import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  currentUser,
  login,
  logOut,
  refreshUser,
  editUser,
  getCounter,
  getOAuthURL,
  loginOAuth,
} from './operations.js';
import toast from 'react-hot-toast';
import { MESSAGES } from '../../constants/constants.js';

const { SUCCESS, ERROR } = MESSAGES;

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
  counter: null,
  OAuthURL: null,
};

const handlePending = state => {
  state.isLoading = true;
};

const handleMessage = message => {
  toast.success(message);
};

const handleError = message => {
  toast.error(message);
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
        handleMessage(SUCCESS.REGISTER);
      })
      .addCase(register.rejected, state => {
        state.isLoggedIn = false;
        handleError(ERROR.REGISTER);
      })

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.data.user;
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
        handleMessage(SUCCESS.LOGIN);
      })
      .addCase(login.rejected, state => {
        state.isLoggedIn = false;
        handleError(ERROR.LOGIN);
      })
      .addCase(logOut.fulfilled, state => {
        state.user = initialState.user;
        state.token = null;
        state.isLoggedIn = false;
        handleMessage(SUCCESS.LOGOUT);
      })
      .addCase(logOut.rejected, state => {
        state.isLoggedIn = false;
        handleError(ERROR.LOGOUT);
      })
      .addCase(currentUser.pending, handlePending)
      .addCase(currentUser.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.isLoading = false;
        state.user = payload.data.user;
      })
      .addCase(currentUser.rejected, state => {
        state.isRefreshing = false;
        state.isLoading = false;
        handleError(ERROR.USER_DATA);
      })
      .addCase(editUser.pending, handlePending)
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        handleMessage(SUCCESS.EDIT_USER);
      })
      .addCase(editUser.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.EDIT_USER);
      })

      .addCase(refreshUser.pending, state => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, state => {
        state.isRefreshing = false;
        state.token = null;
        handleError(ERROR.REFRESH);
      })
      .addCase(getCounter.fulfilled, (state, { payload }) => {
        state.counter = payload.data.usersCount;
      })

      .addCase(getOAuthURL.pending, handlePending)
      .addCase(getOAuthURL.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.OAuthURL = payload.data.url;
      })
      .addCase(getOAuthURL.rejected, state => {
        state.isLoading = false;
        handleError(ERROR.GET_OAUTH_URL);
      })
      .addCase(loginOAuth.pending, handlePending)
      .addCase(loginOAuth.fulfilled, (state, { payload }) => {
        state.OAuthURL = '';
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = payload.data.token;
        handleMessage();
      })
      .addCase(loginOAuth.rejected, state => {
        state.OAuthURL = '';
        state.isLoading = false;
        handleError(ERROR.LOGIN_OAUTH);
      });
  },
});

export const authReducer = authSlice.reducer;
