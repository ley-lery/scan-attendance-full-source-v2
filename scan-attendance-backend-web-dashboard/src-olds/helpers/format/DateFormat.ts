import type { DateValue } from "@heroui/react";

export const formatDateValue = (date: DateValue | null) =>
  date ? date.toString() : null;
