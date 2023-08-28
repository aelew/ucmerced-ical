export type CodeDescriptionResponse = { code: string; description: string }[];

export type InstructorMeetingTimesResponse = {
  fmt: {
    category: string;
    class: string;
    courseReferenceNumber: string;
    faculty: [
      {
        bannerId: string;
        category: string;
        class: string;
        courseReferenceNumber: string;
        displayName: string;
        emailAddress: string;
        primaryIndicator: boolean;
        term: string;
      }
    ];
    meetingTime: {
      beginTime: string;
      building: string | null;
      buildingDescription: string | null;
      campus: string | null;
      campusDescription: string | null;
      room: string | null;
      category: string;
      class: string;
      courseReferenceNumber: string;
      creditHourSession: number;
      startDate: string;
      endDate: string;
      endTime: string;
      hoursWeek: number;
      meetingScheduleType: string;
      meetingType: string;
      meetingTypeDescription: string;
      term: string;
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
    term: string;
  }[];
};
