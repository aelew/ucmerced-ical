'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export function Sonner() {
  const { theme, systemTheme } = useTheme();
  return (
    <Toaster
      richColors
      theme={
        theme === 'system'
          ? systemTheme
          : (theme as 'light' | 'dark' | undefined)
      }
    />
  );
}
