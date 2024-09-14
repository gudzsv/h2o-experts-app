import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
// import { authReducer } from './auth/slice.js';
// // Заглушка для ред'юсерів
// const placeholderReducer = (state = {}, action) => {
//   return state;
// };

// Конфігурація store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: placeholderReducer,
    // water: placeholderReducer,
  },
});

// Заглушка для persistStore, якщо використовуєте redux-persist
// export const persistor = {
//   persist: () => {},
//   purge: () => {},
// };
