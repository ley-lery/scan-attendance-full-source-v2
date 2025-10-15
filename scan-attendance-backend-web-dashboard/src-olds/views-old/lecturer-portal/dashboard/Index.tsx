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
  // const location = useLocation();
  // const branchCode = location.state?.branchCode;
  const [quantity] = useState<Quantities[]>([
    {
      number: 5000,
      table_name: "Students",
      title: "នាក់",
      icon: <FaRegCircleUser size={22} />,
      color: "text-green-500",
    },
    {
      number: 30,
      table_name: "Rooms",
      title: "បន្ទប់",
      icon: <IoHomeOutline size={22} />,
      color: "text-yellow-500",
    },
    {
      number: 60,
      table_name: "Sessions",
      title: "សម័យ",
      icon: <CgTime size={22} />,
      color: "text-blue-500",
    },
    {
      number: 3,
      table_name: "Turn",
      title: "វេន",
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
                  icon={data.icon}
                  subtitle={data.title}
                  number={data.number}
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
