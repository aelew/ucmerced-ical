import { createEvents, type DateArray, type EventAttributes } from 'ics';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { TZ_DATA, WEEK_DAYS } from '@/lib/constants';
import {
  getClassDetails,
  getInstructorMeetingTimes,
  getSubjects
} from '@/lib/ucmerced';
import type {
  InstructorMeetingTimesResponse,
  CodeDescriptionResponse
} from '@/types/ucmerced';

const schema = z.object({
  term: z.string(),
  condense: z.boolean(),
  crns: z.array(z.string().length(5))
});

export async function POST(request: Request) {
  const data = await request.json();

  const result = schema.safeParse(data);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 422 }
    );
  }

  const { term, condense, crns } = result.data;
  if (!crns.length) {
    return NextResponse.json(
      { error: 'Please enter at least 1 CRN!' },
      { status: 422 }
    );
  }

  if (term === '') {
    return NextResponse.json(
      { error: 'Please select a term!' },
      { status: 422 }
    );
  }

  // Get class details and meeting times for each CRN
  const courses: {
    details: string;
    classes: InstructorMeetingTimesResponse['fmt'];
  }[] = [];
  for (const crn of crns) {
    let details;
    try {
      details = await getClassDetails(term, crn);
    } catch {
      return NextResponse.json(
        {
          error:
            `Failed to locate class details for CRN ${crn}. ` +
            'Please check your CRN and try again.'
        },
        { status: 422 }
      );
    }
    let classes;
    try {
      classes = await getInstructorMeetingTimes(term, crn);
    } catch {
      return NextResponse.json(
        {
          error:
            `Failed to locate instructor meeting times for CRN ${crn}. ` +
            'Please check your CRN and try again.'
        },
        { status: 422 }
      );
    }
    courses.push({
      details,
      classes
    });
  }

  let subjects: CodeDescriptionResponse = [];
  if (condense) {
    try {
      subjects = await getSubjects(term);
    } catch {
      return NextResponse.json(
        { error: 'Failed to load subjects for the selected term. Please try again.' },
        { status: 422 }
      );
    }
  }

  // Create an event for each class
  const eventData: EventAttributes[] = [];
  for (const course of courses) {
    let courseTitle;
    if (condense) {
      const subject = safeExtract(course.details, '<span id="subject">', '</span>');
      const subjectCode = subject
        ? subjects.find((s) => s.description === subject)?.code
        : undefined;
      if (subjectCode) {
        const courseNumber = safeExtract(
          course.details,
          '<span id="courseNumber">',
          '</span>'
        );
        if (courseNumber) {
          courseTitle = `${subjectCode} ${courseNumber}`;
        } else {
          courseTitle =
            safeExtract(course.details, '<span id="courseTitle">', '</span>') ??
            'Course';
        }
      } else {
        courseTitle =
          safeExtract(course.details, '<span id="courseTitle">', '</span>') ??
          'Course';
      }
    } else {
      courseTitle =
        safeExtract(course.details, '<span id="courseTitle">', '</span>') ??
        'Course';
    }

    for (const cls of course.classes) {
      const startDateParts = cls.meetingTime.startDate.split('/');
      const startHour = parseInt(cls.meetingTime.beginTime.slice(0, 2));
      const startMins = parseInt(cls.meetingTime.beginTime.slice(2));

      const endDateParts = cls.meetingTime.endDate.split('/');
      const endHour = parseInt(cls.meetingTime.endTime.slice(0, 2));
      const endMins = parseInt(cls.meetingTime.endTime.slice(2));

      const untilArray = incrementDay(
        convertUTCtoPST([
          parseInt(endDateParts[2]),
          parseInt(endDateParts[0]),
          parseInt(endDateParts[1]),
          endHour,
          endMins
        ])
      );
      const until =
        untilArray
          .slice(0, 3)
          .map((v) => v.toString().padStart(2, '0'))
          .join('') + 'T000000Z';

      const recurrenceDays = WEEK_DAYS.filter((day) => cls.meetingTime[day])
        .map((day) => day.slice(0, 2).toUpperCase())
        .join(',');

      let organizerName;
      if (cls.faculty.length) {
        const displayNameParts = cls.faculty[0].displayName.split(', ');
        organizerName = `${displayNameParts[1]} ${displayNameParts[0]}`;
      }

      let location;
      if (cls.meetingTime.building) {
        let building;
        switch (cls.meetingTime.building) {
          case 'CLSSRM':
            building = 'COB1';
            break;
          case 'KOLLIG':
            building = 'KL';
            break;
          case 'SCIENG':
            building = 'SE';
            break;
          default:
            building = cls.meetingTime.building;
            break;
        }
        location = `${building} ${cls.meetingTime.room}`;
      }

      eventData.push({
        calName: 'UC Merced',
        title: `${courseTitle} (${cls.meetingTime.meetingTypeDescription} - ${cls.meetingTime.courseReferenceNumber})`,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${recurrenceDays};UNTIL=${until}`,
        productId: 'aelew/ucmerced-ical',
        busyStatus: 'BUSY',
        location,
        organizer: cls.faculty.length
          ? {
              name: organizerName,
              email: cls.faculty[0].emailAddress
            }
          : undefined,
        start: convertUTCtoPST([
          parseInt(startDateParts[2]),
          parseInt(startDateParts[0]),
          parseInt(startDateParts[1]),
          startHour,
          startMins
        ]),
        duration: {
          minutes: calculateDuration(
            cls.meetingTime.beginTime,
            cls.meetingTime.endTime
          )
        }
      });
    }
  }

  // Create .ics file data
  const { value: icsData } = createEvents(eventData);
  if (!icsData) {
    return NextResponse.json(
      { error: 'Failed to create events.' },
      { status: 500 }
    );
  }

  // Explicitly set the timezone to avoid issues with DST
  const fixedData = icsData
    .insertBefore('BEGIN:VEVENT', TZ_DATA + '\n')
    .insertBefore('X-PUBLISHED-TTL', 'X-LIC-LOCATION:America/Los_Angeles\n')
    .insertBefore('X-PUBLISHED-TTL', 'X-WR-TIMEZONE:America/Los_Angeles\n')
    .replaceAll('DTSTART', 'DTSTART;TZID=America/Los_Angeles');

  return NextResponse.json({ success: true, data: fixedData });
}

declare global {
  interface String {
    insertBefore(needle: string, data: string): string;
  }
}

String.prototype.insertBefore = function (needle: string, data: string) {
  const index = this.indexOf(needle);
  return this.slice(0, index) + data + this.slice(index);
};

function calculateDuration(beginTime: string, endTime: string) {
  // Convert the time strings to numbers
  const beginHours = parseInt(beginTime.substring(0, 2));
  const beginMinutes = parseInt(beginTime.substring(2));
  const endHours = parseInt(endTime.substring(0, 2));
  const endMinutes = parseInt(endTime.substring(2));

  // Calculate the total minutes for each time
  const totalBeginMinutes = beginHours * 60 + beginMinutes;
  const totalEndMinutes = endHours * 60 + endMinutes;

  // Calculate the difference in minutes
  const differenceInMinutes = totalEndMinutes - totalBeginMinutes;

  return differenceInMinutes;
}

function convertUTCtoPST(dateArray: [number, number, number, number, number]) {
  const [year, month, day, hour, minute] = dateArray;

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const pstYear = date.getFullYear();
  const pstMonth = date.getMonth() + 1;
  const pstDay = date.getDate();
  const pstHour = date.getHours();
  const pstMinute = date.getMinutes();

  return [pstYear, pstMonth, pstDay, pstHour, pstMinute] satisfies DateArray;
}

function incrementDay(dateArray: [number, number, number, number, number]) {
  const [year, month, day, hour, minute] = dateArray;

  const lastDayOfMonth = new Date(year, month, 0).getDate();

  // Check if incrementing the day would exceed the last day of the month
  if (day + 1 > lastDayOfMonth) {
    // Check if incrementing the month would exceed December
    if (month + 1 > 12) {
      // Increment the year and set the month to January
      return [year + 1, 1, 1, hour, minute];
    } else {
      // Increment the month and set the day to 1
      return [year, month + 1, 1, hour, minute];
    }
  } else {
    // Increment the day and keep other fields unchanged
    return [year, month, day + 1, hour, minute];
  }
}

function safeExtract(source: string, startToken: string, endToken: string) {
  const parts = source.split(startToken);
  if (parts.length < 2) return undefined;
  const rest = parts[1].split(endToken);
  return rest.length < 2 ? undefined : rest[0];
}
