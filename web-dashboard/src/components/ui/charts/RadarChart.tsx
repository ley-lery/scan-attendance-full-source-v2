import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import "tailwindcss/tailwind.css";

// Register Chart.js utils
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const RadarChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Check-Ins",
        data: [65, 59, null, 81, 56, 55], // Skipping the third data point (March) by setting it to null
        backgroundColor: "rgba(179, 181, 198, 0.2)",
        borderColor: "rgba(179, 181, 198, 1)",
        pointBackgroundColor: "rgba(179, 181, 198, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179, 181, 198, 1)",
      },
      {
        label: "Check-Outs",
        data: [28, 48, 40, 19, 96, 27], // Normal dataset without any skipped points
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    scale: {
      ticks: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full ">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
