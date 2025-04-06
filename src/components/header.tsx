import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeSwitcher } from './theme-switcher';
import { buttonVariants } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/25">
      <div className="container flex h-16 items-center gap-4 sm:justify-between sm:gap-0">
        <div className="flex min-w-0 gap-2">
          <Image
            src="/images/calendar.png"
            className="drop-shadow"
            alt="Calendar icon"
            draggable={false}
            height={28}
            width={28}
          />
          <span className="truncate text-lg font-medium tracking-tighter">
            UC Merced iCalendar Tool
          </span>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-1">
          <ThemeSwitcher />
          <Link href="https://github.com/aelew/ucmerced-ical" target="_blank">
            <div className={buttonVariants({ size: 'icon', variant: 'ghost' })}>
              <GitHubLogoIcon className="size-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
