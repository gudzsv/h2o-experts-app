// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { getTheme, setTheme } from './theme.js';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('follows the system by default', () => {
    expect(getTheme()).toBe('auto');
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('applies and remembers a chosen theme', () => {
    setTheme('dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(getTheme()).toBe('dark');
  });

  it('goes back to the system with auto', () => {
    setTheme('light');
    setTheme('auto');

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('ignores an unknown saved value', () => {
    localStorage.setItem('theme', 'purple');

    expect(getTheme()).toBe('auto');
  });
});
