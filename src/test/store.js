import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../redux/auth/slice.js';
import { waterReducer } from '../redux/water/slice.js';

// A store with the real reducers; `units`, `weekWater` and `stats` are the
// bits the volume-related and stats components read.
export const createTestStore = ({
  units,
  user,
  weekWater = [],
  stats = null,
} = {}) => {
  const auth = authReducer(undefined, { type: 'test/init' });
  const water = waterReducer(undefined, { type: 'test/init' });

  return configureStore({
    reducer: { auth: authReducer, water: waterReducer },
    preloadedState: {
      auth: { ...auth, user: { ...auth.user, ...user, units } },
      water: { ...water, weekWater, stats },
    },
  });
};
