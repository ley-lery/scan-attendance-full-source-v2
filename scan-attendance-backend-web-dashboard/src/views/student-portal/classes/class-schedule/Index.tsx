import { useEffect, useMemo } from 'react';
import Schedule from './Schedule';
import { useFetch } from '@/hooks/useFetch';
import { Accordion, AccordionItem } from '@heroui/react';
import { Loading } from '@/components/hero-ui';
import { MetricCard } from '@/components/ui';
import { IoCalendarOutline } from 'react-icons/io5';

const Index = () => {
  const { data, loading } = useFetch<ApiResponse>("/student/schedule/list");
  const rows = data?.data?.rows ?? [];
  const statistics = data?.data?.statistics ?? {};

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

  const CardStatistics = [
    {
      title: "Total Schedule",
      value: statistics.total_schedule,
      icon: <IoCalendarOutline size={20} />,
      variant: 'primary',
      desc: "Total number of schedules",
      type: 'Total',
      maxValue: 4
    },
    {
      title: "Active Schedule",
      value: statistics.active_schedule,
      icon: <IoCalendarOutline size={20} />,
      variant: 'success',
      desc: "Active number of schedules",
      type: 'Active',
      maxValue: 4
    },
    {
      title: "Inactive Schedule",
      value: statistics.inactive_schedule,
      icon: <IoCalendarOutline size={20} />,
      variant: 'danger',
      desc: "Inactive number of schedules",
      type: 'Inactive',
      maxValue: 4
    },
    {
      title: "Completed Schedule",
      value: statistics.complete_schedule,
      icon: <IoCalendarOutline size={20} />,
      variant: 'success',
      desc: "Completed number of schedules",
      type: 'Completed',
      maxValue: 4
    }
  ]

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center ">
        <Loading />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">No schedule data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 *:px-0">
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {CardStatistics.map((item, index) => (
          <MetricCard 
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            variant={item.variant as any}
            description={item.desc}
            type={item.type}
            maxValue={item.maxValue}
            classNames={{
              base: "bg-white dark:bg-zinc-800"
            }}
          />
        ))}
      </div>
      <Accordion variant="splitted" itemClasses={{ base: "shadow-none rounded-2xl bg-white dark:bg-zinc-800"}} >
        {scheduleList.map(({ classInfo, scheduleData } : { classInfo: ClassInfo, scheduleData: ScheduleData }, index: number) => (
          <AccordionItem
            key={index}
            title={`${classInfo.field_name_en} - Year ${classInfo.study_year} - Term ${classInfo.term_no}`}
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
