/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { DAYS, type Course, type Day, type SessionType } from "@/types/schedule";
import { getTimeSlotsForSession, isTimeConflict } from "@/utils/timeUtils";
import ClassBlock from "./ClassBlock";
import TimeSlot from "./TimeSlot";
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow } from "@heroui/react";
import { VscJson } from "react-icons/vsc";
import { IoImageOutline } from "react-icons/io5";
import { Suspense, lazy } from "react";
const Modal = lazy(() => import("@heroui/react").then(mod => ({ default: mod.Modal })));
interface ScheduleGridProps {
  row?: any;
  courses: Course[];
  session: SessionType;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onAddCourseAtSlot?: (day: Day, time: string) => void;
  turn?: "morning" | "afternoon" | "evening";
  isOpenPrintModal?: boolean;
  onOpenChangePrintModal?: (isOpenPrintModal: boolean) => void;
  onExportJSON?: () => void;
  onExportPNG?: () => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  row,
  courses,
  session,
  onEditCourse,
  onDeleteCourse,
  onAddCourseAtSlot,
  turn = "morning",
  isOpenPrintModal,
  onOpenChangePrintModal,
  onExportJSON,
  onExportPNG,
}) => {

  useEffect(() => {
    console.log("Row data: ", row);
  }, [])

  const [formData, setFormData] = React.useState({
    notes: {
      noteOne: "រាល់បញ្ហាផ្សេងៗដែលទាក់ទងនឺងសាស្រ្តាចារ្យ និសិត្សតអាចទាក់ទងដោយផ្ទាល់តាមរយះទូរស័ព្ទលេខ: 088 750 600/012727979",
      noteTwo: "សាស្រ្តាចារ្យមានកាតពកិច្ចប្រគល់លទ្ធផលឆមាសរបស់និសិត្សមកការិយាល័យព្រឹទ្ធបុរស ក្រោយពីបញ្ចប់ឆមាស ០១សប្តាហ៍",
      noteThree: "ថ្ងៃផុតកំណត់បង់ថ្លៃសិក្សា: May 21, 2025",
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [name]: value,
      },
    }));
  }

  const timeSlots = getTimeSlotsForSession(session);
  const metaCourse = courses[0] as any;

  const getCoursesForDayAndTime = (day: Day, timeSlot: string): Course[] => {
    return courses.filter(
      (course) => course.day === day && course.timeSlot === timeSlot,
    );
  };

  const hasTimeConflict = (course: Course): boolean => {
    return courses.some(
      (otherCourse) =>
        otherCourse.id !== course.id &&
        otherCourse.day === course.day &&
        isTimeConflict(
          course.startTime,
          course.endTime,
          otherCourse.startTime,
          otherCourse.endTime,
        ),
    );
  };

  return (
    <div className="space-y-4">
     <div>
        {/* Header Info */}
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="*:text-center *:font-semibold">
              <h2>Schedule for Bachelor of Law</h2>
              <p>Field: {row?.field_name_en}</p>
            </div>
            <div className="flex items-center gap-40">
              <div className="flex gap-6 space-y-2">
                <div className="mt-2 flex flex-col gap-2">
                  <span>
                    Promotion: {row?.promotion_no}
                  </span>
                  <span className="capitalize">{turn} Class</span>
                </div>
                <div className="space-y-2 *:flex *:gap-8">
                  <div>
                    <span>Stage: {row?.stage}</span>
                    <span>Group: {row?.group}</span>
                    <span className="ml-40">Year {row?.year}</span>
                    <span>Semester {row?.term_no}</span>
                  </div>
                  <div>
                    <span>Start Date: {row?.start_date}</span>
                    <span>
                      Mid-term: {row?.mid_term_start_date} to{" "}
                      {row?.mid_term_end_date}
                    </span>
                  </div>
                  <div>
                    <span>ថ្ងៃផត់កំណត់បង់ថ្លៃសិក្សា: Aug 15, 2025</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span>Final: {row?.final_exam_date}</span>
                <span>New Term Start: {row?.new_term_start_date}</span>
                <span>Room: {row?.room_name}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Schedule Grid */}
        <div className="border-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-500 dark:bg-zinc-900">
          <div className="w-full bg-primary-400 p-2 text-center capitalize text-white dark:bg-zinc-700">
            {turn}
          </div>
          <div className="min-w-[800px]">
            {/* Column Headers */}
            <div className="grid grid-cols-8 bg-primary-600 text-white dark:bg-zinc-600">
              <div className="flex items-center justify-center border-b border-r border-t border-zinc-200 dark:border-zinc-500">
                <span className="text-sm font-semibold">Day/Time</span>
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="border-b border-r border-t border-zinc-200 p-2 text-center dark:border-zinc-500"
                >
                  <span className="text-base">{day}</span>
                </div>
              ))}
            </div>

            {/* Rows of TimeSlots */}
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.label}
                className="grid grid-cols-8 items-start justify-center border-zinc-200 text-xs font-medium text-zinc-600 dark:border-zinc-500 dark:text-zinc-300"
              >
                <div className="flex h-full items-center justify-center border-b border-r text-base font-medium">
                  <h2>{timeSlot.label}</h2>
                </div>

                {DAYS.map((day, dayIndex) => {
                  const items = getCoursesForDayAndTime(day, timeSlot.label);

                  return (
                    <TimeSlot
                      key={`${day}-${timeSlot.label}`}
                      day={day}
                      time={timeSlot.label}
                      isEven={dayIndex % 2 === 0}
                      hasItem={items.length > 0}
                      onClick={() => onAddCourseAtSlot?.(day, timeSlot.label)}
                    >
                      {items.map((course) => (
                        <ClassBlock
                          key={course.id}
                          course={course}
                          onEdit={onEditCourse}
                          onDelete={onDeleteCourse}
                          isConflict={hasTimeConflict(course)}
                        />
                      ))}
                    </TimeSlot>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="absolute left-0 top-0 "/>}>
        <Modal isOpen={isOpenPrintModal} onOpenChange={onOpenChangePrintModal} size="full" scrollBehavior="inside" classNames={{
            closeButton: "hover:bg-zinc-100 active:bg-zinc-200"
          }}>
            <ModalContent className="bg-white">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-blue-950">Print Schedule</ModalHeader>
                  <ModalBody className="has-scrollbar">
                    <ScrollShadow className="h-full has-scrollbar">
                      <div id="schedule-grid" className="space-y-4 pb-20 px-20 ">
                          {/* Header Info */}
                          <div>
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="*:text-blue-950">
                                <h2 className="text-2xl font-semibold text-center">សកលវិទ្យាល័យបៀលប្រាយ</h2>
                                <h3 className="text-2xl font-serif font-semibold text-center uppercase">Build Bright University</h3>
                                <p className="text-center font-semibold font-serif">Schedule for Bachelor of Law</p>
                                <p className="text-center font-semibold font-serif">Field: Information Technology</p>
                              </div>
                              <div className="flex items-center gap-40 *:text-blue-950">
                                <div className="flex gap-6 space-y-2">
                                  <div className="mt-2 flex flex-col gap-2 *:font-semibold *:font-serif">
                                    <span>
                                      Promotion: {row?.promotion_no}
                                    </span>
                                    <span className="capitalize">{turn} Class</span>
                                    <span>Code: 3005</span>
                                  </div>
                                  <div className="space-y-2 *:flex *:gap-8">
                                    <div className="*:font-semibold *:font-serif">
                                      <span>Stage: {row?.stage}</span>
                                      <span>Group: {row?.group ?? "No Group"}</span>
                                      <span className="ml-40">Year {row?.year}</span>
                                      <span>Semester {row?.term_no}</span>
                                    </div>
                                    <div className="*:font-semibold *:font-serif">
                                      <span>Start Date: {row?.start_date}</span>
                                      <span>
                                        Mid-term: {row?.mid_term_start_date} to{" "}
                                        {row?.mid_term_end_date}
                                      </span>
                                    </div>
                                    <span className="font-semibold font-serif">Num.Stud: 34</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 font-serif *:font-semibold">
                                  <span>Final: {row?.final_exam_date}</span>
                                  <span>New Term Start: {row?.new_term_start_date}</span>
                                  <span>Room: {row?.room_name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Schedule Grid */}
                          <div className="border-100  border border-blue-950 bg-white ">
                            <div className="min-w-[800px]">
                              {/* Column Headers */}
                              <div className="grid grid-cols-8  text-blue-950 *:font-semibold *:font-serif">
                                <div className="flex items-center justify-center border-b border-r border-t border-blue-950 ">
                                  <span className="text-sm ">Day/Time</span>
                                </div>
                                {DAYS.map((day) => (
                                  <div
                                    key={day}
                                    className="border-b border-r border-t border-blue-950 h-10  print:flex print:justify-center justify-center flex items-center text-center "
                                  >
                                    <span className="text-base ">{day}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Rows of TimeSlots */}
                            {timeSlots.map((timeSlot: any, index: number) => (
                                <React.Fragment key={timeSlot.label}>
                                  <div
                                    className="grid grid-cols-8 items-start justify-center border-blue-950 text-xs font-medium text-zinc-600 "
                                  >
                                    <div className="flex h-full border-blue-950 items-center justify-center border-b border-t border-r text-base font-semibold">
                                      <h2>{timeSlot.label}</h2>
                                    </div>

                                    {DAYS.map((day, dayIndex) => {
                                      const items = getCoursesForDayAndTime(day, timeSlot.label);

                                      return (
                                        <TimeSlot
                                          key={`${day}-${timeSlot.label}`}
                                          day={day}
                                          time={timeSlot.label}
                                          isEven={dayIndex % 2 === 0}
                                          hasItem={items.length > 0}
                                          hasPrint={true}
                                        >
                                          {items.map((course) => (
                                            <ClassBlock
                                              key={course.id}
                                              course={course}
                                              onEdit={onEditCourse}
                                              onDelete={onDeleteCourse}
                                              isConflict={hasTimeConflict(course)}
                                              hasPrint={true}
                                            />
                                          ))}
                                        </TimeSlot>
                                      );
                                    })}
                                  </div>

                                  {/* Insert break after first row */}
                                  {index === 0 && (
                                    <div className="grid grid-cols-8 border-zinc-200 ">
                                      <p className="col-span-8 flex justify-center items-center py-2 text-sm font-semibold text-zinc-700 ">
                                        Break Time 10mns
                                      </p>
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}

                            </div>
                          </div>
                        <div className="flex items-start gap-4 ">
                            <h2 className="text-blue-950 font-semibold">សម្គល់:</h2>
                            <ul className="*:text-blue-950 *:font-semibold *:text-base w-full ">
                              <li className="flex items-start gap-2">
                                - 
                                <textarea
                                  name="noteOne"
                                  onChange={handleChange}
                                  value={formData.notes.noteOne}
                                  className="w-full resize-none bg-white"
                                  rows={2}
                                />
                              </li>
                              <li className="flex items-start gap-2">
                                - 
                                <textarea
                                  name="noteTwo"
                                  onChange={handleChange}
                                  value={formData.notes.noteTwo}
                                  className="w-full resize-none bg-white"
                                  rows={2}
                                />
                              </li>
                              <li className="flex items-start gap-2">
                                - 
                                <textarea
                                  name="noteThree"
                                  onChange={handleChange}
                                  value={formData.notes.noteThree}
                                  className="w-full resize-none bg-white"
                                  rows={2}
                                />
                              </li>
                            </ul>
                          </div>

                          <div className="grid grid-cols-3">
                            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950">
                              <p>Siem Reap: ...................... 2025 Acting</p>
                              <p>President of Build Bright University</p>
                              <p>Vice President</p>
                            </div>
                            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950">
                              <p>Siem Reap: ...................... 2025 Acting</p>
                              <p>President of Build Bright University</p>
                              <p>Vice President</p>
                            </div>
                            <div className="*:text-center *:font-[600] *:text-base *:font-serif *:text-blue-950">
                              <p>Siem Reap: ...................... 2025 Acting</p>
                              <p>President of Build Bright University</p>
                              <p>Vice President</p>
                            </div>
                          </div>
                      </div>
                    </ScrollShadow>

                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="secondary" onPress={onExportJSON} startContent={<VscJson size={20} />}>
                      Export as JSON
                    </Button>
                    <Button color="primary" onPress={onExportPNG} startContent={<IoImageOutline  size={20} />}>
                      Export as Jpeg
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
        </Modal>
      </Suspense>
    </div>
  );
};

export default ScheduleGrid;
