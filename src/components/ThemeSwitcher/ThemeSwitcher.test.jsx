import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import ThemeSwitcher from './ThemeSwitcher.jsx';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('starts on auto and switches the page theme at once', () => {
    render(<ThemeSwitcher />);
    const radio = name => screen.getByRole('radio', { name });

    expect(radio('Auto').getAttribute('aria-checked')).toBe('true');

    fireEvent.click(radio('Dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(radio('Dark').getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(radio('Auto'));
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
