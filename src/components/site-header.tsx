import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeSwitcher } from './theme-switcher';
import { buttonVariants } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link className="flex min-w-0 space-x-2" href="/">
          <Image
            src="/images/calendar.png"
            className="drop-shadow"
            alt="Calendar icon"
            height={24}
            width={24}
          />
          <span className="truncate font-semibold">UC Merced iCal Tool</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-1">
          <ThemeSwitcher />
          <Link href="https://github.com/aelew/ucmerced-ical" target="_blank">
            <div className={buttonVariants({ size: 'icon', variant: 'ghost' })}>
              <GitHubLogoIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
