import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

export const useMedia = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });

  return useMemo(
    () => ({
      isDesktop,
    }),
    [isDesktop]
  );
};

export default useMedia;
