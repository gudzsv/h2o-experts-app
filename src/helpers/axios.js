import axios from 'axios';

export const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://h2o-experts-server.onrender.com',
  withCredentials: true,
});

const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

let refreshPromise = null;

export const setupInterceptors = ({ refresh, onAuthFailure }) => {
  API.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        AUTH_URLS.some(url => originalRequest.url?.includes(url))
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        refreshPromise ??= refresh().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      } catch {
        onAuthFailure?.();
        return Promise.reject(error);
      }
    }
  );
};
