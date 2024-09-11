import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://connections-api.goit.global';

const setAuthHeader = (token) => {
	axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
	axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
	'auth/register',
	async (registerData, thunkAPI) => {
		try {
			const response = await axios.post('/users/signup', registerData);
			setAuthHeader(response.data.token);

			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const login = createAsyncThunk(
	'auth/login',
	async (loginData, thunkAPI) => {
		try {
			const response = await axios.post('/users/login', loginData);
			setAuthHeader(response.data.token);

			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
	console.log('thunkAPI: ', thunkAPI);
	try {
		const response = await axios.post('/users/logout');
		clearAuthHeader();

		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.message);
	}
});

export const refreshUser = createAsyncThunk(
	'auth/refresh',
	async (_, thunkAPI) => {
		const state = thunkAPI.getState();
		const persistedToken = state.auth.token;

		// if (!persistedToken) {
		// 	return thunkAPI.rejectWithValue('Unable to fetch user');
		// }
		try {
			setAuthHeader(persistedToken);
			const response = await axios.get('/users/current');
			console.log('response: ', response);
			// setAuthHeader(response.token);

			return response.data;
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
