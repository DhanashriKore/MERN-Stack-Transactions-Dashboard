import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Categories',
        data: Object.values(data),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ]
      }
    ]
  };

  return <Pie data={chartData} />;
};

export default PieChart;
