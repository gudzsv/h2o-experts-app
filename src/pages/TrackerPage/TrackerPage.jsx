import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Container from 'components/Container/Container.jsx';
import PageContent from 'components/PageContent/PageContent.jsx';
import WaterMainInfo from 'components/WaterMainInfo/WaterMainInfo.jsx';
import WaterDetailedInfo from 'components/WaterDetailedInfo/WaterDetailedInfo.jsx';
import WaterModalProvider from 'components/WaterModal/WaterModalProvider.jsx';
import OnboardingModal from 'components/OnboardingModal/OnboardingModal.jsx';
import { selectUser } from '../../redux/auth/selectors';
import { needsOnboarding } from '../../helpers/onboarding.js';

const TrackerPage = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  // The profile is loaded after the page mounts, so this follows the user
  // state: it opens once the profile is known to have no weight and closes
  // after saving (a weight appears) or skipping.
  const [isOnboardingClosed, setIsOnboardingClosed] = useState(false);
  const isOnboardingOpen = !isOnboardingClosed && needsOnboarding(user);

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
    </Container>
  );
};
export default TrackerPage;
