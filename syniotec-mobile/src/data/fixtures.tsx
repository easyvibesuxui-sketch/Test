import type { DayMark } from '../components/Calendar';
import { buildDayRun } from '../components/Calendar';
import type { RequestItem } from '../components/RequestRow';
import { SickGlyph, VacationGlyph } from '../components/Artwork';

/** Copy in the Figma frames is dated Sept–Oct 2025; the fixtures follow it. */
export const YEAR = 2025;
export const SEPTEMBER = 8;
export const SELECTED_DAY = 21;

/** Indicator dots on the September calendar, read off the design. */
export const SEPTEMBER_MARKS: Record<number, DayMark> = {
  3: 'worked',
  6: 'pending',
  8: 'worked',
  10: 'worked',
  12: 'worked',
  14: 'worked',
  16: 'worked',
  19: 'worked',
  21: 'worked',
  23: 'pending',
  25: 'planned',
  26: 'worked',
};

export const SEPTEMBER_DAYS = buildDayRun(YEAR, SEPTEMBER, SEPTEMBER_MARKS);

/** The visible window of the collapsed strip (Sun 18 → Mon 26). */
export const STRIP_DAYS = SEPTEMBER_DAYS.slice(17, 26);

/** The two requests summarised on the tracking screens. */
export const SUMMARY_REQUESTS: RequestItem[] = [
  {
    kind: 'Vacation',
    date: '23.Oct.2025',
    status: 'Pending',
    icon: <VacationGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    icon: <SickGlyph />,
  },
];

const SICK_NOTE =
  'clearly state you are unwell, specify the date you will be absent, and mention your expected return date if known';

export const OPEN_REQUESTS: RequestItem[] = [
  {
    kind: 'Vacation',
    date: '23.Oct.2025',
    status: 'Pending',
    icon: <VacationGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    by: 'Max Mustermann',
    icon: <SickGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    by: 'Max Mustermann',
    icon: <SickGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    by: 'Max Mustermann',
    icon: <SickGlyph />,
  },
];

export const REQUEST_HISTORY: RequestItem[] = [
  {
    kind: 'Vacation',
    date: '23.Oct.2025',
    status: 'Finished',
    icon: <VacationGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Declined',
    note: SICK_NOTE,
    tone: 'rose',
    icon: <SickGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    note: SICK_NOTE,
    tone: 'plain',
    icon: <SickGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    note: SICK_NOTE,
    tone: 'plain',
    icon: <SickGlyph />,
  },
  {
    kind: 'Sick day',
    date: '28.Oct.2025',
    status: 'Approved',
    note: SICK_NOTE,
    tone: 'rose',
    icon: <SickGlyph />,
  },
];

export type Assignment = {
  dateLabel: string;
  timeLabel: string;
  project: string;
  start: string;
  end: string;
  city: string;
  address: string;
  status?: 'Pending';
  /** The filled timeline dot marks the assignment in progress. */
  current?: boolean;
};

export const ASSIGNMENTS: Assignment[] = [
  {
    dateLabel: '21 oct',
    timeLabel: '08:00 AM',
    project: 'Halensee Roadworks',
    start: '21 October 2025  08:00 AM',
    end: '22 October 2025  13:45 PM',
    city: 'Halensee, Germany.',
    address: '5 Franziuseck Bremen, 28199 DE, Germany',
    current: true,
  },
  {
    dateLabel: '22 oct',
    timeLabel: '08:00 AM',
    project: 'Halensee Roadworks',
    start: '16 October 2025  08:00 AM',
    end: '17 October 2025  13:45 PM',
    city: 'Halensee, Germany.',
    address: '5 Franziuseck Bremen, 28199 DE, Germany',
  },
  {
    dateLabel: '23 oct',
    timeLabel: '09:30 AM',
    project: 'Bremen Bridge Repair',
    start: '18 October 2025  09:30 AM',
    end: '18 October 2025  17:00 PM',
    city: 'Bremen, Germany.',
    address: 'Marktstraße 15, 28195 DE, Germany',
    status: 'Pending',
  },
];

export type TimesheetEntry = {
  kind: 'Working' | 'Brake';
  duration: string;
  start: string;
  end: string;
};

export type TimesheetDay = {
  dateLabel: string;
  project: string;
  total: string;
  entries: TimesheetEntry[];
};

const ENTRIES: TimesheetEntry[] = [
  {
    kind: 'Working',
    duration: '08:45',
    start: '21 October 2025  08:00 AM',
    end: '22 October 2025  13:45 PM',
  },
  {
    kind: 'Brake',
    duration: '08:45',
    start: '21 October 2025  08:00 AM',
    end: '22 October 2025  13:45 PM',
  },
  {
    kind: 'Working',
    duration: '08:45',
    start: '21 October 2025  08:00 AM',
    end: '22 October 2025  13:45 PM',
  },
];

export const TIMESHEET_DAYS: TimesheetDay[] = [
  {
    dateLabel: '21 oct',
    project: 'Halensee Roadworks',
    total: '7 h 48 m',
    entries: ENTRIES,
  },
  {
    dateLabel: '23 oct',
    project: 'Halensee Roadworks',
    total: '7 h 48 m',
    entries: ENTRIES,
  },
];
