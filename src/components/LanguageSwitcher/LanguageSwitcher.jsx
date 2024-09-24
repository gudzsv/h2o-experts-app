import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import en from '../../assets/icons/lang/en-us.svg';
import uk from '../../assets/icons/lang/uk.svg';
import css from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (event, lang) => {
    if (event.target.tagName === 'IMG') {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = event => {
    if (event.target.tagName === 'IMG') {
      setIsDropdownOpen(prev => !prev);
    }
  };

  const availableLanguages = language === 'en' ? ['uk'] : ['en'];

  const languageTranslate = t('lang.language');

  return (
    <div className={css.languageSwitcher} ref={selectRef}>
      <button
        className={css.languageSelect}
        onClick={toggleDropdown}
        aria-label={t('lang.select')}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <img
          className={css.languageIcon}
          src={language === 'en' ? en : uk}
          alt={languageTranslate}
          width="18"
          height="18"
        />
      </button>
      <ul
        className={`${css.languageDropdown} ${isDropdownOpen ? css.show : ''}`}
        ref={dropdownRef}
        role="menu"
      >
        {availableLanguages.map(lang => (
          <li
            key={lang}
            className={css.languageOption}
            onClick={event => handleLanguageChange(event, lang)}
            role="menuitem"
            tabIndex="0"
          >
            <img
              className={css.languageIcon}
              src={lang === 'en' ? en : uk}
              alt={languageTranslate}
              width="18"
              height="18"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
