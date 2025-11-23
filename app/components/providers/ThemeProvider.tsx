'use client';

import { useEffect } from 'react';
import { useStore } from '@/app/store/useStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    // Apply theme to html element
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
