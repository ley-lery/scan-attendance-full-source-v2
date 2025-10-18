import React from "react";
import { TimeSlot } from "@/components/ui/schedule/TimeSlot";
import { BreakTime } from "@/components/ui/schedule/BreakTime";
import { ScheduleInfo } from "@/components/ui/schedule/ScheduleInfo";
import { ScrollShadow } from "@heroui/react";


interface Props {
  data: ScheduleData;
  classInfo: ClassInfo;
}

const Schedule: React.FC<Props> = ({ data, classInfo }) => {

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = Object.keys(data);

  
  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="mx-auto">

        {/* Header info */}
        <ScheduleInfo classInfo={classInfo} />

        {/* Schedule Table */}
        <div className=" shadow-lg overflow-auto mt-6">
          {/* Desktop View */}
            <table className="w-full border-collapse scale-[0.85]">
              <thead>
                <tr className="bg-white dark:bg-zinc-800 ">
                  <th className="py-2 px-4 text-center font-bold border border-blue-950 text-blue-950 dark:border-zinc-700 dark:text-zinc-100">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="py-2 px-4 text-center font-bold border border-blue-950 text-blue-950 dark:border-zinc-700 dark:text-zinc-100"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, idx) => {
                  // Check if this is the first time slot to add break after it
                  const isFirstSlot = idx === 0;
                  
                  return (
                    <React.Fragment key={time}>
                      <tr className="bg-white dark:bg-zinc-800">
                        <td className="py-3 px-4 font-semibold text-center border border-blue-950 min-w-40 w-40 dark:border-zinc-700 dark:text-zinc-100">
                          {time}
                        </td>
                        {days.map((day) => {
                          const course = data[time][day];
                          return (
                            <TimeSlot 
                              key={`${time}-${day}`} 
                              time={time} 
                              day={day} 
                              course={course} 
                            />
                          );
                        })}
                      </tr>
                      {isFirstSlot && (
                        <BreakTime />
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
        </div>

        {/* Footer info  */}
        <div className="space-y-6">
          <div className="flex gap-2 items-start mt-6">
            <p className="text-blue-900 font-bold dark:text-zinc-400">សម្គាល់ :</p>
            <ul className="*:text-blue-900 *:font-bold *:dark:text-zinc-100">
              <li> - រាល់បញ្ហាផ្សេងៗដែលទាក់ទងនឺងសាស្រ្តាចារ្យ និសិត្សតអាចទាក់ទងដោយផ្ទាល់តាមរយះទូរស័ព្ទលេខ: 088 750 600/012727979</li>
              <li> - សាស្រ្តាចារ្យមានកាតពកិច្ចប្រគល់លទ្ធផលឆមាសរបស់និសិត្សមកការិយាល័យព្រឹទ្ធបុរស ក្រោយពីបញ្ចប់ឆមាស ០១សប្តាហ៍</li>
              <li> - ថ្ងៃផុតកំណត់បង់ថ្លៃសិក្សា: May 21, 2025</li>
            </ul>
          </div>
          <div className="grid grid-cols-3">
            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950 *:dark:text-zinc-100">
              <p>Siem Reap: ...................... 2025 Acting</p>
              <p>President of Build Bright University</p>
              <p>Vice President</p>
            </div>
            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950 *:dark:text-zinc-100">
              <p>Siem Reap: ...................... 2025 Acting</p>
              <p>President of Build Bright University</p>
              <p>Vice President</p>
            </div>
            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950 *:dark:text-zinc-100">
              <p>Siem Reap: ...................... 2025 Acting</p>
              <p>President of Build Bright University</p>
              <p>Vice President</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
