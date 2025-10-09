import { useEffect, useMemo } from 'react';
import Schedule from './Schedule';
import { useFetch } from '@/hooks/useFetch';
import { Accordion, AccordionItem } from '@heroui/react';
import { Loading } from '@/components/hero-ui';

const Index = () => {
  const { data, loading } = useFetch<ApiResponse>("/student/schedule/list");
  const rows = data?.data?.rows ?? [];

  useEffect(() => {
    console.log("Fetched schedule data:", data);
  }, [data]);

  // Transform each class's schedule items into a structured schedule map
  const transformData = (classData: ClassData) => {
    const scheduleData: Record<string, Record<string, any>> = {};

    // Collect all time slots
    const timeSlots = new Set<string>();
    classData.schedule_items?.forEach((item) => {
      timeSlots.add(item.timeSlot);
    });

    // Initialize empty structure
    timeSlots?.forEach((timeSlot) => {
      scheduleData[timeSlot] = {
        Monday: null,
        Tuesday: null,
        Wednesday: null,
        Thursday: null,
        Friday: null,
        Saturday: null,
        Sunday: null,
      };
    });

    // Fill structure with real data
    classData.schedule_items?.forEach((item) => {
      if (!scheduleData[item.timeSlot]) {
        scheduleData[item.timeSlot] = {
          Monday: null,
          Tuesday: null,
          Wednesday: null,
          Thursday: null,
          Friday: null,
          Saturday: null,
          Sunday: null,
        };
      }
      scheduleData[item.timeSlot][item.day] = {
        name: item.subject,
        credits: item.credit,
        room: item.room,
        instructor: item.instructor,
        phone: item.tel,
      };
    });

    return scheduleData;
  };

  const scheduleList = useMemo(() => {
    return rows.map((row: ClassData) => ({
      classInfo: row,
      scheduleData: transformData(row),
    }));
  }, [rows]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loading />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 text-lg">No schedule data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Accordion variant="bordered">
        {scheduleList.map(({ classInfo, scheduleData } : { classInfo: ClassInfo, scheduleData: ScheduleData }, index: number) => (
          <AccordionItem
            key={index}
            title={`Year ${classInfo.year} - ${classInfo.field_name_en}`}
            aria-label={`Schedule ${index + 1}`}
          >
            <Schedule data={scheduleData} classInfo={classInfo} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Index;
