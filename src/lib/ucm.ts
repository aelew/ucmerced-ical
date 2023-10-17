import ky from 'ky';

import {
  CodeDescriptionResponse,
  InstructorMeetingTimesResponse
} from '@/types/ucm';

const api = ky.create({
  prefixUrl: 'https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb',
  headers: { 'user-agent': 'ucmerced-ical' }
});

export async function getAcademicTerms() {
  const searchParams = new URLSearchParams();
  searchParams.set('searchTerm', ' ');
  searchParams.set('offset', '1');
  searchParams.set('max', '5');
  return api
    .get('classSearch/getTerms', { searchParams })
    .json<CodeDescriptionResponse>();
}

export async function getSubjects(term: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('searchTerm', '');
  searchParams.set('term', term);
  searchParams.set('offset', '1');
  searchParams.set('max', '999');
  return api
    .get('classSearch/get_subject', { searchParams })
    .json<CodeDescriptionResponse>();
}

export async function getClassDetails(term: string, crn: string) {
  const formData = new FormData();
  formData.append('term', term);
  formData.append('courseReferenceNumber', crn);
  formData.append('first', 'first');
  return api.post('searchResults/getClassDetails', { body: formData }).text();
}

export async function getInstructorMeetingTimes(term: string, crn: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('term', term);
  searchParams.set('courseReferenceNumber', crn);
  const { fmt } = await api
    .get('searchResults/getFacultyMeetingTimes', { searchParams })
    .json<InstructorMeetingTimesResponse>();
  return fmt;
}
