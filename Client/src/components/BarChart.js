import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Number of Items',
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  return <Bar data={chartData} />;
};

export default BarChart;
