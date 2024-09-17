import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <LanguageSwitcher />
      <br />
      {t('homePage.title')}
    </div>
  );
};

export default HomePage;
