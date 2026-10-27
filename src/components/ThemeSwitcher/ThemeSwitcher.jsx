import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTheme, setTheme, THEMES } from '../../helpers/theme.js';
import css from './ThemeSwitcher.module.css';

// Applies at once and is kept in this browser, so it is a control of its
// own rather than a field of the profile form that is saved to the server.
const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const [theme, setCurrent] = useState(getTheme);

  const choose = (event, value) => {
    event.stopPropagation();
    setTheme(value);
    setCurrent(value);
  };

  return (
    <div className={css.wrapper}>
      <span className={css.label} id="themeLabel">
        {t('theme.label')}
      </span>
      <div className={css.options} role="radiogroup" aria-labelledby="themeLabel">
        {THEMES.map(value => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={theme === value}
            className={clsx(css.option, theme === value && css.active)}
            onClick={event => choose(event, value)}
          >
            {t(`theme.${value}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
