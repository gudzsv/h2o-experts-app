// The color theme is a choice of this browser: "auto" follows the system,
// "light" and "dark" set data-theme on <html>, which colors.css reads.
// index.html applies the saved choice before the page paints, so a dark
// theme does not flash light on load; keep its storage key in sync.
const STORAGE_KEY = 'theme';

export const THEMES = ['auto', 'light', 'dark'];

export const getTheme = () => {
  try {
    const theme = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(theme) ? theme : 'auto';
  } catch {
    return 'auto';
  }
};

export const applyTheme = theme => {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
};

export const setTheme = theme => {
  applyTheme(theme);
  try {
    if (theme === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Without storage the choice lasts until the page reloads.
  }
};
