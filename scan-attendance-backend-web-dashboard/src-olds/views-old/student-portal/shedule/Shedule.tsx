/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DAYS } from "@/types/schedule";
import { Card, ScrollShadow } from "@heroui/react";
import ClassBlock from "./ClassBlock";
import TimeSlot from "./TimeSlot";
import { getTimeSlotsForSession } from "@/utils/timeUtils";
import { useNavigate } from "react-router-dom";

// Define Course type
interface Course {
  id: number;
  day: typeof DAYS[number];
  timeSlot: string; 
  subject: string;
  credit: number;
  room: string;
  tel: string;
  instructor: string;
}

interface Props{
  courses?: Course[];
  row?: any;
}

const Shedule = ({courses = [], row}: Props) => {
  const navigate = useNavigate();
  const timeSlots = getTimeSlotsForSession("Morning");

  const turn = "Morning";

  // Filter courses by day and time slot label (must be exact match)
  const getCoursesForDayAndTime = (day: typeof DAYS[number], timeSlotLabel: string): Course[] => {
    return courses.filter((course) => course.day === day && course.timeSlot === timeSlotLabel);
  };

  const handleGoAttFilter = (id: string | number) => {
    navigate('/student/attendance', { state: { id: id } });
  }

  return (
    <Card className="card-ui">
      <ScrollShadow className="h-full has-scrollbar">
        <div className="space-y-4 py-10 ">
          {/* Header Info */}
          <div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="*:text-blue-950 dark:*:text-zinc-200">
          <h2 className="text-2xl font-semibold text-center">សកលវិទ្យាល័យបៀលប្រាយ</h2>
          <h3 className="text-2xl font-lora font-semibold text-center uppercase">
            Build Bright University
          </h3>
          <p className="text-center font-semibold font-lora">Schedule for Bachelor of Law</p>
          <p className="text-center font-semibold font-lora">Field: Information Technology</p>
              </div>
              <div className="flex items-center gap-40 *:text-blue-950 dark:*:text-zinc-200">
          <div className="flex gap-6 space-y-2">
            <div className="mt-2 flex flex-col gap-2 *:font-semibold *:font-lora">
              <span>Promotion: {row.promotion_no}</span>
              <span className="capitalize">{turn} Class</span>
              <span>Code: {row.code}</span>
            </div>
            <div className="space-y-2 *:flex *:gap-8">
              <div className="*:font-semibold *:font-lora">
                <span>Stage: {row.stage}</span>
                <span>Group: {row.group ?? "No Group"}</span>
                <span className="ml-40">Year {row.year}</span>
                <span>Semester {row.term_no}</span>
              </div>
              <div className="*:font-semibold *:font-lora">
                <span>Start Date: {row.start_date}</span>
                <span>
                  Mid-term: {row.mid_term_start_date} to {row.mid_term_end_date}
                </span>
              </div>
              <span className="font-semibold font-lora">Num.Stud: 34</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-lora *:font-semibold">
            <span>Final: {row.final_exam_date}</span>
            <span>New Term Start: {row.new_term_start_date}</span>
            <span>Room: {row.room_name}</span>
          </div>
              </div>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="border-b-0 border border-blue-950 dark:border-zinc-700 bg-white dark:bg-transparent">
            <div className="min-w-[800px]">
              {/* Column Headers */}
              <div className="grid grid-cols-8 text-blue-950 dark:text-zinc-200 *:font-semibold *:font-lora">
                <div className="flex items-center justify-center border-r border-blue-950 dark:border-zinc-700">
                  <span className="text-sm">Day/Time</span>
                </div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="border-blue-950 border-r dark:border-zinc-700 h-10 print:flex print:justify-center justify-center flex items-center text-center"
                  >
                    <span className="text-base">{day}</span>
                  </div>
                ))}
              </div>

              {/* Rows of TimeSlots */}
              {timeSlots.map((timeSlot, index) => (
                <React.Fragment key={timeSlot.label}>
                  <div className="grid grid-cols-8 items-start justify-center border-blue-950 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-200">
                    <div className="flex h-full border-blue-950 dark:border-zinc-700 items-center justify-center border-b border-t text-base font-semibold">
                      <h2>{timeSlot.label}</h2>
                    </div>

                    {DAYS.map((day) => {
                      const items = getCoursesForDayAndTime(day, timeSlot.label);

                      return (
                        <TimeSlot key={`${day}-${timeSlot.label}`} day={day} time={timeSlot.label} hasItem={items.length > 0}>
                          {items.map((course: Course) => (
                            <ClassBlock
                              key={course.id}
                              course={course}
                              onView={() => {
                                handleGoAttFilter(course.id)
                              }}
                            />
                          ))}
                        </TimeSlot>
                      );
                    })}
                  </div>

                  {/* Insert break after first row */}
                  {index === 0 && (
                    <div className="grid grid-cols-8 border-zinc-200 dark:border-zinc-700">
                      <p className="col-span-8 flex justify-center items-center py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Break Time 10mns
                      </p>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </ScrollShadow>
    </Card>
  );
};

export default Shedule;
