import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface AttendanceBarChartProps {
  presentData: number[];
  absentData: number[];
  lateData: number[];   
  labels: string[]; // e.g., ["Week 1", "Week 2", "Week 3"]
}

const AttendanceBarChart: React.FC<AttendanceBarChartProps> = ({
  presentData,
  absentData,
  lateData, // NEW
  labels,
}) => {
const data = {
  labels,
  datasets: [
    {
      label: "Present Students",
      data: presentData,
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Absent Students",
      data: absentData,
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "Late Students", // NEW
      data: lateData,
      backgroundColor: "rgba(255, 206, 86, 0.6)", // Light yellow
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
    },
  ],
};


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "University Attendance Overview",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks / Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Students",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AttendanceBarChart;
