import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Stats from './components/Stats';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('03');  // Default to March
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/transactions/combined`, { params: { month } });
      setTransactions(response.data.transactions);
      setStats(response.data.statistics);
      setBarData(response.data.barChart);
      setPieData(response.data.pieChart);
    };
    fetchData();
  }, [month]);

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <label>
        Select Month:
        <select value={month} onChange={e => setMonth(e.target.value)}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          {/* Add more months */}
        </select>
      </label>

      <TransactionsTable transactions={transactions} />
      <Stats stats={stats} />
      <BarChart data={barData} />
      <PieChart data={pieData} />
    </div>
  );
};

export default App;
