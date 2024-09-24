import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import useMedia from '../../hooks/useMedia';
import Container from 'components/Container/Container';
import PageContent from 'components/PageContent/PageContent';
import ResetPwdSection from 'components/ResetPwdSection/ResetPwdSection';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const ResetPwdPage = () => {
  const { isDesktop } = useMedia();
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('pages.resetPwd')}</title>
      </Helmet>
      <PageContent>
        <ResetPwdSection />
        {isDesktop && <AdvantagesSection />}
      </PageContent>
    </Container>
  );
};

export default ResetPwdPage;
