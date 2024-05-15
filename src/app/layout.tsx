import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';

import { Header } from '@/components/header';
import { Sonner } from '@/components/sonner';
import { Spotlight } from '@/components/spotlight';
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
          'min-h-screen bg-background antialiased',
          GeistSans.className
        )}
      >
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-violet-100 via-teal-50 to-amber-100 dark:hidden" />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">{children}</div>
            <Spotlight className="-top-40 left-0 hidden dark:block md:-top-20 md:left-60" />
          </div>
          <Sonner />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
