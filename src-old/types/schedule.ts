export interface Course {
  id: string;
  subject: string;
  credits: number;
  room: string;
  lecturer: string;
  tel?: string;
  day: Day;
  timeSlot: string;
  startTime: string;
  endTime: string;
}
export interface Law {
  promotion: number;
  stage: number;
  year: number;
  semester: number;
  turn: SessionType;
  startDate: string;
  midTermStartDate: string;
  midTermEndDate: string;
  final: string;
  newTermStartDate: string;
  group: string;
}

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type SessionType = "Morning" | "Afternoon" | "Evening";

export interface Group {
  id: string;
  name: string;
  session: SessionType;
}

export interface Schedule {
  turn: SessionType;
  group: string;
  groupLabel?: string; // Optional label for the group
  schedule: Course[];
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export const DAYS: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MORNING_TIME_SLOTS: TimeSlot[] = [
  { start: "07:20", end: "08:50", label: "7:20-8:50" },
  { start: "09:05", end: "10:35", label: "9:05-10:35" },
];

export const AFTERNOON_TIME_SLOTS: TimeSlot[] = [
  { start: "13:00", end: "14:30", label: "1:00-2:30" },
  { start: "14:45", end: "16:15", label: "2:45-4:15" },
]

export const EVENING_TIME_SLOTS: TimeSlot[] = [
  { start: "18:00", end: "19:30", label: "6:00-7:30" },
  { start: "18:00", end: "20:00", label: "8:00-9:00" },
];

