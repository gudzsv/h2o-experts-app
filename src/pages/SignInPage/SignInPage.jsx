import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import useMedia from '../../hooks/useMedia';
import Container from 'components/Container/Container';
import PageContent from 'components/PageContent/PageContent';
import SignInSection from 'components/SignInSection/SignInSection';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignInPage = () => {
  const { isDesktop } = useMedia();
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('pages.signIn')}</title>
      </Helmet>
      <PageContent>
        <SignInSection />
        {isDesktop && <AdvantagesSection />}
      </PageContent>
    </Container>
  );
};

export default SignInPage;
