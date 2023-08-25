'use client';

import { CalendarIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import { ChangeEvent, FormEvent, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function CourseForm({ children }: PropsWithChildren) {
  const [generating, setGenerating] = useState(false);
  const [crns, setCrns] = useState(['']);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);
    fetch('/api/generate', {
      body: JSON.stringify({
        term: e.currentTarget.term.value,
        crns: crns.filter((crn) => !!crn)
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    })
      .then((response) =>
        response
          .json()
          .then((result) => {
            if (result.error) {
              return toast.error(result.error);
            }
            const blob = new Blob([result.data], { type: 'text/calendar' });
            const link = document.createElement('a');
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', 'calendar.ics');
            document.body.appendChild(link);
            link.click();
            toast.success('Calendar generated!');
          })
          .catch(() => toast.error('Uh oh! An unexpected error occurred.'))
      )
      .finally(() => setGenerating(false));
  };

  const handleInputUpdate = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (
      !value.length ||
      (!isNaN(Number(e.target.value)) && value.length <= 5)
    ) {
      setCrns((prev) => {
        const values = [...prev];
        values[index] = value;
        return values;
      });
    }
  };

  const addEntry = () => setCrns((prev) => [...prev, '']);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Course schedule generator</CardTitle>
          <CardDescription>
            Enter your 5-digit course reference numbers (CRNs) below to generate
            an Apple Calendar file to import into your calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {children}
          <div
            className={cn('grid gap-3', crns.length > 1 && 'sm:grid-cols-2')}
          >
            {crns.map((crn, index) => (
              <div className="grid w-full items-center gap-2" key={index}>
                <Label htmlFor={`course-${index}`}>CRN #{index + 1}</Label>
                <Input
                  onChange={(e) => handleInputUpdate(e, index)}
                  id={`course-${index}`}
                  placeholder="00000"
                  inputMode="numeric"
                  minLength={5}
                  maxLength={5}
                  value={crn}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-6">
          <Button className="w-full" disabled={generating}>
            {generating ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}{' '}
            Create my calendar
          </Button>
          <Button
            onClick={addEntry}
            className="w-full"
            variant="outline"
            type="button"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add another course
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
