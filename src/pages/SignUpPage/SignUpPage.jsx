import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import useMedia from '../../hooks/useMedia';
import Container from 'components/Container/Container';
import PageContent from 'components/PageContent/PageContent';
import SignUpSection from 'components/SignUpSection/SignUpSection';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignUpPage = () => {
  const { isDesktop } = useMedia();
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('pages.signUp')}</title>
      </Helmet>
      <PageContent>
        <SignUpSection />
        {isDesktop && <AdvantagesSection />}
      </PageContent>
    </Container>
  );
};

export default SignUpPage;
