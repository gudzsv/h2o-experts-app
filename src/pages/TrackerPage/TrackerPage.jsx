import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Container from 'components/Container/Container.jsx';
import PageContent from 'components/PageContent/PageContent.jsx';
import WaterMainInfo from 'components/WaterMainInfo/WaterMainInfo.jsx';
import WaterDetailedInfo from 'components/WaterDetailedInfo/WaterDetailedInfo.jsx';
import WaterModalProvider from 'components/WaterModal/WaterModalProvider.jsx';
import OnboardingModal from 'components/OnboardingModal/OnboardingModal.jsx';
import WeeklyRecapModal from 'components/WeeklyRecapModal/WeeklyRecapModal.jsx';
import { selectUser } from '../../redux/auth/selectors';
import { selectStats } from '../../redux/water/selectors.js';
import { getStats } from '../../redux/water/operations.js';
import { needsOnboarding } from '../../helpers/onboarding.js';
import { toDateKey } from '../../helpers/date.js';
import {
  getWeeklyRecap,
  isRecapDue,
  markRecapSeen,
} from '../../helpers/weeklyRecap.js';

const TrackerPage = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  // The profile is loaded after the page mounts, so this follows the user
  // state: it opens once the profile is known to have no weight and closes
  // after saving (a weight appears) or skipping.
  const [isOnboardingClosed, setIsOnboardingClosed] = useState(false);
  const isOnboardingOpen = !isOnboardingClosed && needsOnboarding(user);

  // The recap of last week, on the first visit of a new week. Stats are only
  // requested while it is due, and never together with the onboarding.
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const todayKey = toDateKey(new Date());
  const email = user?.email;
  const [isRecapDueNow, setIsRecapDueNow] = useState(false);
  const isProfileReady = Boolean(email) && !needsOnboarding(user);

  useEffect(() => {
    if (isProfileReady && isRecapDue(email, todayKey)) {
      setIsRecapDueNow(true);
      dispatch(getStats());
    }
  }, [dispatch, email, isProfileReady, todayKey]);

  // Stats left from an earlier day are not today's.
  const isStatsFresh = stats?.days.at(-1)?.date === todayKey;
  const recap = isRecapDueNow && isStatsFresh ? getWeeklyRecap(stats) : null;

  // Nothing to sum up still counts as seen, so the stats are not requested on
  // every visit this week.
  useEffect(() => {
    if (isRecapDueNow && isStatsFresh && !recap) {
      markRecapSeen(email, todayKey);
      setIsRecapDueNow(false);
    }
  }, [email, isRecapDueNow, isStatsFresh, recap, todayKey]);

  const closeRecap = () => {
    markRecapSeen(email, todayKey);
    setIsRecapDueNow(false);
  };

  return (
    <Container>
      <Helmet>
        <title>{t('pages.tracker')}</title>
      </Helmet>
      <WaterModalProvider>
        <PageContent>
          <WaterMainInfo />
          <WaterDetailedInfo />
        </PageContent>
      </WaterModalProvider>
      {isOnboardingOpen && (
        <OnboardingModal isOpen onClose={() => setIsOnboardingClosed(true)} />
      )}
      {!isOnboardingOpen && recap && (
        <WeeklyRecapModal recap={recap} onClose={closeRecap} />
      )}
    </Container>
  );
};
export default TrackerPage;
