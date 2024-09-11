import { configureStore } from '@reduxjs/toolkit';

// Заглушка для ред'юсерів
const placeholderReducer = (state = {}, action) => {
  return state;
};

// Конфігурація store
export const store = configureStore({
  reducer: {
    // Додаємо заглушки для всіх ред'юсерів
    auth: placeholderReducer,
    user: placeholderReducer,
    water: placeholderReducer,
  },
});

// Заглушка для persistStore, якщо використовуєте redux-persist
export const persistor = {
  persist: () => {},
  purge: () => {},
};
