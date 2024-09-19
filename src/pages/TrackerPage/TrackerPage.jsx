// import { Helmet } from 'react-helmet-async';
// import { useTranslation } from 'react-i18next';
// import Container from 'components/Container/Container.jsx';
// import PageContent from 'components/PageContent/PageContent.jsx';
// import WaterMainInfo from 'components/WaterMainInfo/WaterMainInfo.jsx';
// import WaterDetailedInfo from 'components/WaterDetailedInfo/WaterDetailedInfo.jsx';

import Statistics from 'components/Statistics/Statistics';

const TrackerPage = () => {
  // const { t } = useTranslation();

  return (
    // <Container>
    //   <Helmet>
    //     <title>{t('pages.tracker')}</title>
    //   </Helmet>
    //   <PageContent>
    //     <WaterMainInfo />
    //     <WaterDetailedInfo />
    //   </PageContent>
    // </Container>
    <Statistics />
  );
};
export default TrackerPage;
