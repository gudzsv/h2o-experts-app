import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Container from 'components/Container/Container.jsx';
import PageContent from 'components/PageContent/PageContent.jsx';
import WelcomeSection from 'components/WelcomeSection/WelcomeSection';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Helmet>
        <title>{t('pages.home')}</title>
      </Helmet>
      <PageContent>
        <WelcomeSection />
        <AdvantagesSection />
      </PageContent>
    </Container>
  );
};

export default HomePage;
