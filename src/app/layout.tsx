import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import { PropsWithChildren } from 'react';

import { Header } from '@/components/header';
import { Sonner } from '@/components/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import './globals.css';

export const metadata: Metadata = {
  title: 'UC Merced iCalendar Tool',
  description:
    'A simple tool for importing UC Merced course schedules into Apple Calendar, Google Calendar, and other calendars that accept ICS files.',
  icons: [
    {
      url: '/images/calendar.png',
      type: 'image/png',
      sizes: '256x256'
    }
  ]
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.className
        )}
      >
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">{children}</div>
          </div>
          <Sonner />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
