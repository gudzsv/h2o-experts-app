import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import { waterReducer } from './water/slice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['token'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // user: placeholderReducer,
    water: waterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Заглушка для persistStore, якщо використовуєте redux-persist
// export const persistor = {
//   persist: () => {},
//   purge: () => {},
// };

export const persistor = persistStore(store);
