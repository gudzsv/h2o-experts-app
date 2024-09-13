import axios from 'axios';
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
        const response = await API.get('/users/current');
        store.dispatch;
      } catch (error) {}
    }
  }
);
