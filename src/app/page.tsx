import { Suspense } from 'react';

import { CourseForm } from '@/components/course-form';
import { TermSelector } from '@/components/term-selector';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col justify-center gap-8 p-8 sm:p-16">
      <h1 className="text-center text-4xl font-semibold tracking-tighter">
        UC Merced iCalendar Tool
      </h1>
      <CourseForm>
        {/* Since CourseForm is a client component, TermSelector must be passed in as a child */}
        <Suspense>
          <TermSelector />
        </Suspense>
      </CourseForm>
    </main>
  );
}
