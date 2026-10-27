import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Container from 'components/Container/Container.jsx';
import PageContent from 'components/PageContent/PageContent.jsx';
import WaterMainInfo from 'components/WaterMainInfo/WaterMainInfo.jsx';
import WaterDetailedInfo from 'components/WaterDetailedInfo/WaterDetailedInfo.jsx';
import WaterModalProvider from 'components/WaterModal/WaterModalProvider.jsx';

const TrackerPage = () => {
  const { t } = useTranslation();

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
    </Container>
  );
};
export default TrackerPage;
