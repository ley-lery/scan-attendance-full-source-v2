import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartTypeRegistry,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Attendance data
const attendanceData = [12, 5, 6]; // Present, Late, Absent
const total = attendanceData.reduce((a, b) => a + b, 0);

const data = {
  labels: ['Present', 'Late', 'Absent'],
  datasets: [
    {
      label: 'Attendance',
      data: attendanceData,
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Blue, Yellow, Red
      borderWidth: 0,
    },
  ],
};

// Custom plugin to draw text in the center
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart: any) => {
    const { width } = chart;
    const { height } = chart;
    const ctx = chart.ctx;
    ctx.restore();
    const fontSize = (height / 100).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = 'middle';
    const text = total.toString();
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillStyle = '#000';
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#666',
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          size: 14,
        },
      },
    },
  },
  cutout: '65%',
};

const DonutChart: React.FC = () => {
  return (
    <div className="w-full max-w-xs mx-auto p-4">
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
};

export default DonutChart;
