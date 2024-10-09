import React from 'react';

const Stats = ({ stats }) => {
  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sales: {stats.totalSales}</p>
      <p>Sold Items: {stats.soldItems}</p>
      <p>Not Sold Items: {stats.notSoldItems}</p>
    </div>
  );
};

export default Stats;
