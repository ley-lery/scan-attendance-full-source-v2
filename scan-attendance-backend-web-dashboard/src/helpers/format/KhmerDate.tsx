import React from "react";
import moment from "moment";
// @ts-ignore
import "moment/locale/km";

interface KhmerDateProps {
  date: string;
  format?: string;
  withDayName?: boolean;
}

export const KhmerDate: React.FC<KhmerDateProps> = ({
  date,
  format = "D MMMM YYYY",
  withDayName = false,
}) => {
  if (!date) return null;

  const parsed = moment(date, ["YY-MM-DD", "YYYY-MM-DD"]);
  if (!parsed.isValid()) return <span>កាលបរិច្ឆេទមិនត្រឹមត្រូវ</span>;

  const display = parsed
    .locale("km")
    .format(withDayName ? `dddd, ${format}` : format);

  return <span>{display}</span>;
};
