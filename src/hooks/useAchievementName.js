import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVolume } from './useVolume.js';

// The name of an achievement tier, for the stats page and its toasts. Volume
// tiers follow the user's units.
export const useAchievementName = () => {
  const { t } = useTranslation();
  const { formatNorm } = useVolume();

  return useCallback(
    ({ track, target }) =>
      track === 'volume'
        ? t('stats.tier.volume', { amount: formatNorm(target) })
        : t(`stats.tier.${track}`, { count: target }),
    [t, formatNorm]
  );
};
