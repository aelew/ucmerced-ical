import { cn } from '@/lib/utils';

import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { SiteHeader } from '@/components/site-header';
import { Sonner } from '@/components/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UC Merced iCal Tool',
  description:
    'A simple tool for importing UC Merced course schedules into Apple Calendar, Google Calendar, and other calendars that accept ICS files.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: [
    {
      url: '/images/calendar.png',
      type: 'image/png',
      sizes: '256x256'
    }
  ]
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex flex-1">{children}</div>
          </div>
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
