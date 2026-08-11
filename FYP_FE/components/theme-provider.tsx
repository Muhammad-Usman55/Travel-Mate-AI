'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    defaultTheme === 'system' ? getSystemTheme() : defaultTheme,
  );

  const applyTheme = useCallback((t: 'light' | 'dark') => {
    const root = document.documentElement;
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(t);
    } else {
      root.setAttribute('data-theme', t);
    }
    setResolved(t);
  }, [attribute]);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      try { localStorage.setItem('theme', t); } catch {}
      if (disableTransitionOnChange) {
        const style = document.createElement('style');
        style.textContent = '*,*::before,*::after{transition:none!important}';
        document.head.appendChild(style);
        requestAnimationFrame(() => style.remove());
      }
      applyTheme(t === 'system' ? getSystemTheme() : t);
    },
    [applyTheme, disableTransitionOnChange],
  );

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) {
        setThemeState(stored);
        applyTheme(stored === 'system' ? getSystemTheme() : stored);
      } else {
        applyTheme(defaultTheme === 'system' ? getSystemTheme() : defaultTheme);
      }
    } catch {
      applyTheme(defaultTheme === 'system' ? getSystemTheme() : defaultTheme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system preference changes
  useEffect(() => {
    if (!enableSystem) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme(getSystemTheme());
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, enableSystem, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
