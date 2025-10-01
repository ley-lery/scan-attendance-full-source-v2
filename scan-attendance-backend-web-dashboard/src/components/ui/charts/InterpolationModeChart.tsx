import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js utils
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const InterpolationModeChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Default Interpolation (Smooth)",
        data: [20, 30, 50, 40, 60, 80],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Smooth curve (default interpolation)
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointRadius: 5,
      },
      {
        label: "Linear Interpolation",
        data: [15, 25, 40, 35, 50, 70],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0, // Straight lines (linear interpolation)
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointRadius: 5,
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
        text: "Line Chart with Interpolation Modes",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default InterpolationModeChart;
