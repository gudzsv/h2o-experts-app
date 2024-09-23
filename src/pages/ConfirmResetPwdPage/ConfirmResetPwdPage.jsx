import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import useMedia from '../../hooks/useMedia';
import Container from 'components/Container/Container';
import PageContent from 'components/PageContent/PageContent';
import ConfirmResetPwdSection from 'components/ConfirmResetPwdSection/ConfirmResetPwdSection';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const ConfirmResetPwdPage = () => {
  const { isDesktop } = useMedia();
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('pages.resetPwd')}</title>
      </Helmet>
      <PageContent>
        <ConfirmResetPwdSection />
        {isDesktop && <AdvantagesSection />}
      </PageContent>
    </Container>
  );
};

export default ConfirmResetPwdPage;
