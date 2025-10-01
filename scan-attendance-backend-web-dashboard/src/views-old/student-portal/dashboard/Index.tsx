import CardUi from "@/components/hero-ui/card/CardUi";
import AttendanceBarChart from "@/components/ui/charts/BarCharts";
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import { FaRegCircle } from "react-icons/fa";

import {  IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
const presentData = [120, 115, 130, 125, 140, 135, 145, 150, 155, 160, 158, 162, 168, 170, 172, 0];
const absentData = [50, 85, 80, 72, 90, 60, 55, 52, 48, 45, 47, 44, 40, 38, 36, 0];
const lateData = [10, 12, 8, 9, 11, 10, 12, 13, 14, 13, 12, 11, 10, 9, 8, 0];

const labels = [
  "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6",
  "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12",
  "Week 13", "Week 14", "Week 15"
];

interface Quantities {
  number: number;
  table_name: string;
  title?: string;
  icon?: React.ReactNode;
  color?: string;
}

const Dashboard = () => {
  const [quantity] = useState<Quantities[]>([
     {
         number: 30,
         table_name: "Presents",
         title: "វត្តមាន",
         icon: <IoIosCheckmarkCircleOutline size={25} />,
         color: "text-green-500",
       },
       {
         number: 4,
         table_name: "Late",
         title: "យឺត",
         icon: <PiWarningCircle size={25} />,
         color: "text-yellow-500",
       },
       {
         number: 2,
         table_name: "Absent",
         title: "អវត្តមាន",
         icon: <SlClose size={22} />,
         color: "text-pink-500",
       },
       {
         number: 36,
         table_name: "Total",
         title: "សរុប",
         icon: <FaRegCircle size={22} />,
         color: "text-blue-500",
       },
    
  ]);
  const [loading] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-lg p-4" />
            ))
          : quantity.map((data, index) => {
              return (
                <CardUi
                    key={index}
                    title={data.table_name}
                    number={data.number}
                    subtitle={data.title}
                    icon={data.icon}
                    color={data.color}
                /> 
              );
            })}
      </div>
      <div className="grid place-content-center rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800">
        <AttendanceBarChart
          presentData={presentData}
          absentData={absentData}
          lateData={lateData}
          labels={labels}
        />
      </div>
    </div>
  );
};

export default Dashboard;
