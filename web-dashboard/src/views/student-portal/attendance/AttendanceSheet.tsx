import { ScrollShadow } from "@heroui/react";
import React from "react";

const getStatusClass = (value: string) => {
  if (value === "P") return "text-success font-semibold";
  if (value === "L") return "text-warning font-semibold";
  if (value === "A") return "text-danger font-semibold";
  if (value === "") return "text-gray-400 font-light";
  return "text-black dark:text-white";
};

interface AttendanceSheetProps {
  sessionDates: Record<number, string>;
  status: string[][];
  sessionCount?: number;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  sessionDates,
  status,
  sessionCount = 30,
}) => {
  const normalizedStatus = (status ?? []).map((row) =>
    Array.from({ length: sessionCount }, (_, i) => row[i] ?? "")
  );

  return (
    <div className="border-0 border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden ">
      <ScrollShadow orientation="horizontal" className="has-scrollbar pb-4">
        <table className="border-collapse text-sm min-w-max text-center">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800">
              <th className="border-0 border-zinc-300 dark:border-zinc-600 w-24 p-2 font-normal text-left pl-2">
                Session
              </th>
              {Array.from({ length: sessionCount }, (_, i) => (
                <th
                  key={i}
                  className="border-l border-zinc-300 dark:border-zinc-600 w-12 p-2"
                >
                  {i + 1}
                </th>
              ))}
            </tr>

            <tr className="bg-zinc-50 dark:bg-zinc-700">
              <td className="border-0 border-t border-zinc-300 dark:border-zinc-700 text-left pl-2 font-normal">
                Date
              </td>
              {Array.from({ length: sessionCount }, (_, i) => (
                <td
                  key={i}
                  className="border-l border-t border-zinc-300 dark:border-zinc-600 text-xs p-2 min-w-20"
                >
                  {sessionDates[i + 1] ?? ""}
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {normalizedStatus.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border-t border-b border-zinc-300 dark:border-zinc-700 font-normal text-left pl-2 py-1">
                  Status
                </td>
                {row.map((value, i) => (
                  <td
                    key={i}
                    className={`border-l border-t border-b border-zinc-300 dark:border-zinc-700 p-1 ${getStatusClass(
                      value
                    )}`}
                  >
                    {value || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollShadow>
    </div>
  );
};

export default AttendanceSheet;
