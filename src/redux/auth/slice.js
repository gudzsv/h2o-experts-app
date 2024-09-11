import { createSlice } from '@reduxjs/toolkit';
import { login, logOut, refreshUser, register } from './operations';

const initialState = {
	user: {
		name: null,
		email: null,
	},
	token: null,
	isLoggedIn: false,
	isRefreshing: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	extraReducers: (builder) => {
		builder
			// .addCase(register.pending, (state, action) => {})
			.addCase(register.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoggedIn = true;
			})
			// .addCase(register.rejected, (state, action) => {})

			// .addCase(login.pending, (state, action) => {})
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoggedIn = true;
			})
			// .addCase(login.rejected, (state, action) => {})

			// .addCase(logOut.pending, (state, action) => {})
			.addCase(logOut.fulfilled, (state) => {
				state.user = { name: null, email: null };
				state.token = null;
				state.isLoggedIn = false;
			})
			// .addCase(logOut.rejected, (state, action) => {})

			.addCase(refreshUser.pending, (state) => {
				state.isRefreshing = true;
			})
			.addCase(refreshUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isLoggedIn = true;
				state.isRefreshing = false;
			})
			.addCase(refreshUser.rejected, (state) => {
				state.isRefreshing = false;
				state.token = null;
			});
	},
});

export const authReducer = authSlice.reducer;
