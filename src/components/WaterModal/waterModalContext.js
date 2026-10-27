import { createContext, useContext } from 'react';

export const WaterModalContext = createContext(null);

export const useWaterModal = () => {
  const context = useContext(WaterModalContext);

  if (!context) {
    throw new Error('useWaterModal must be used inside WaterModalProvider');
  }

  return context;
};
