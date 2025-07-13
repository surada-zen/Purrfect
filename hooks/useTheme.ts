
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Theme } from '../types';

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'dark' : 'light');
    root.classList.add(isDark ? 'dark' : 'light');
  }, [theme]);

  return [theme, setTheme];
};
