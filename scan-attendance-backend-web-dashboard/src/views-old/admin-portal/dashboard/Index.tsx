import CardUi from "@/components/hero-ui/card/CardUi";
import AttendanceBarChart from "@/components/ui/charts/BarCharts";
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import { CgTime } from "react-icons/cg";
import { FaRegCircleUser } from "react-icons/fa6";

import {  IoIosTrendingUp } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
const presentData = [120, 115, 130, 125, 140];
const absentData = [50, 85, 80, 72, 90];
const lateData = [50, 85, 80, 72, 90];
const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

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
      number: 5000,
      table_name: "Students",
      title: "student",
      icon: <FaRegCircleUser size={22} />,
      color: "text-green-500",
    },
    {
      number: 30,
      table_name: "Rooms",
      title: "rooms",
      icon: <IoHomeOutline size={22} />,
      color: "text-yellow-500",
    },
    {
      number: 60,
      table_name: "Sessions",
      title: "session",
      icon: <CgTime size={22} />,
      color: "text-blue-500",
    },
    {
      number: 3,
      table_name: "Turn",
      title: "turn",
      icon: <IoIosTrendingUp size={22} />,
      color: "text-pink-500",
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
          labels={labels}
          lateData={lateData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
