import ky from 'ky';

import { InstructorMeetingTimesResponse, TermsResponse } from '@/types/ucm';

const api = ky.create({
  prefixUrl: 'https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb',
  headers: { 'user-agent': 'ucmerced-ical' }
});

export async function getAcademicTerms() {
  return api
    .get('classSearch/getTerms?searchTerm=&offset=1&max=5')
    .json<TermsResponse>();
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
