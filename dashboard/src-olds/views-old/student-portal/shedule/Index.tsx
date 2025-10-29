/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionItem,
  ScrollShadow,
  Skeleton
} from "@heroui/react";
import Shedule from "./Shedule";
import { DAYS } from "@/types/schedule";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaRegCircle
} from "react-icons/fa";
import CardUi from "@/components/hero-ui/card/CardUi";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";

// ==========================
// Interfaces
// ==========================
interface ScheduleRow {
  year: number;
  term_no: number;
}

interface Course {
  day: string;
  [key: string]: any;
}

interface ScheduleItem {
  row: ScheduleRow;
  schedule: Course[];
}

interface Cards {
  title: string;
  number: number;
  subtitle?: string;
}

// ==========================
// Constants
// ==========================

const SUMMARY_CARDS: Cards[] = [
  { title: "Total Years", number: 4, subtitle: "Years" },
  { title: "Total Semesters", number: 8, subtitle: "Semesters" },
  { title: "Total Schedules", number: 8, subtitle: "Schedules" },
  { title: "Total Events", number: 8, subtitle: "Events" }
];

const ICONS = [
  <LiaUniversitySolid className="text-2xl" />,
  <IoCalendarOutline className="text-xl" />,
  <IoCalendarOutline className="text-xl" />,
  <FaRegCircle className="text-2xl" />
];

const COLORS = [
  "text-blue-500",
  "text-yellow-500",
  "text-purple-500",
  "text-green-500"
];

// ==========================
// Component
// ==========================
const Index = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("/api/student-schedule.json");
        console.log("Schedule data:", res.data);
        setSchedule(res.data.semester || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="sticky top-0 z-10">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-gray-500">Manage your schedule and view upcoming events</p>
        </div>
        
      </div>

      {/* Body */}
      <ScrollShadow className="h-[37rem] 3xl:h-[52rem] p-4 space-y-4 has-scrollbar">
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg p-4" />
              ))
            : SUMMARY_CARDS.map((item, i) => (
                <CardUi
                  key={i}
                  number={item.number}
                  title={item.title}
                  subtitle={item.subtitle}
                  color={COLORS[i % COLORS.length]}
                  icon={ICONS[i % ICONS.length]}
                />
              ))}
        </div>

        {/* Accordion Schedule Section */}
          <Accordion variant="light" defaultSelectedKeys={["1"]} showDivider>
          {
            schedule.map((item: any, index: number) => (
              <AccordionItem
                key={index}
                aria-label={`Accordion ${index + 1}`}
                title={`Schedule Year ${item.row.year}, Semester ${item.row.term_no}`}
                className="overflow-hidden"
              >
                <Shedule
                  courses={item.schedule.map((course: { day: string; }) => ({
                    ...course,
                    day: course.day as typeof DAYS[number]
                  }))}
                  row={item.row}
                />
              </AccordionItem>
            ))
          }
        </Accordion>
      </ScrollShadow>
     
    </div>
  );
};

export default Index;
