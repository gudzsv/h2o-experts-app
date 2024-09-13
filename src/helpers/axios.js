import axios from 'axios';
import { currentUser, refreshUser } from 'redux/auth/operations';
import { store } from 'redux/store';

export const API = axios.create({
  baseURL: '',
  withCredentials: true,
});

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config; // can use directly error.config._retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        store.dispatch(refreshUser());
        store.dispatch(currentUser());
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error('Token refresh failed:', refreshError);
        API.defaults.headers.common.Authorization = '';
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
