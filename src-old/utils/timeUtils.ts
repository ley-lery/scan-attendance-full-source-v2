import {
  type TimeSlot,
  type SessionType,
  MORNING_TIME_SLOTS,
  EVENING_TIME_SLOTS,
  AFTERNOON_TIME_SLOTS,
} from "../types/schedule";

export const getTimeSlotsForSession = (session: SessionType): TimeSlot[] => {
  if (session === "Morning") return MORNING_TIME_SLOTS;
  if (session === "Afternoon") return AFTERNOON_TIME_SLOTS;
  return EVENING_TIME_SLOTS;
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isTimeConflict = (
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string,
): boolean => {
  const start1 = timeToMinutes(startTime1);
  const end1 = timeToMinutes(endTime1);
  const start2 = timeToMinutes(startTime2);
  const end2 = timeToMinutes(endTime2);

  return start1 < end2 && start2 < end1;
};

export const generateTimeSlotLabel = (
  startTime: string,
  endTime: string,
): string => {
  return `${formatTime(startTime)}-${formatTime(endTime)}`;
};
