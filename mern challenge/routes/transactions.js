const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Seed database with third-party API data
router.get('/init', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(response.data);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions with search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const query = { dateOfSale: { $regex: new RegExp(`^\\d{4}-${month}-`, 'i') } };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: parseFloat(search) || 0 }
    ];
  }

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));
  res.json(transactions);
});

// Get statistics for selected month
router.get('/stats', async (req, res) => {
  const { month } = req.query;
  const transactions = await Transaction.find({
    dateOfSale: { $regex: new RegExp(`^\\d{4}-${month}-`, 'i') }
  });

  const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
  const soldItems = transactions.filter(t => t.sold).length;
  const notSoldItems = transactions.filter(t => !t.sold).length;

  res.json({
    totalSales,
    soldItems,
    notSoldItems
  });
});

// Get bar chart data (price ranges)
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const transactions = await Transaction.find({
    dateOfSale: { $regex: new RegExp(`^\\d{4}-${month}-`, 'i') }
  });

  const ranges = {
    '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
    '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0,
  };

  transactions.forEach(t => {
    if (t.price <= 100) ranges['0-100']++;
    else if (t.price <= 200) ranges['101-200']++;
    else if (t.price <= 300) ranges['201-300']++;
    // Continue with other ranges
    else ranges['901-above']++;
  });

  res.json(ranges);
});

// Get pie chart data (categories)
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  const transactions = await Transaction.find({
    dateOfSale: { $regex: new RegExp(`^\\d{4}-${month}-`, 'i') }
  });

  const categoryCounts = {};
  transactions.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  res.json(categoryCounts);
});

// Get combined response of stats, bar chart, and pie chart
router.get('/combined', async (req, res) => {
  const { month } = req.query;
  const transactions = await Transaction.find({
    dateOfSale: { $regex: new RegExp(`^\\d{4}-${month}-`, 'i') }
  });

  const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
  const soldItems = transactions.filter(t => t.sold).length;
  const notSoldItems = transactions.filter(t => !t.sold).length;

  const ranges = {
    '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
    '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0,
  };

  transactions.forEach(t => {
    if (t.price <= 100) ranges['0-100']++;
    else if (t.price <= 200) ranges['101-200']++;
    // Continue other ranges
    else ranges['901-above']++;
  });

  const categoryCounts = {};
  transactions.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  res.json({
    statistics: { totalSales, soldItems, notSoldItems },
    barChart: ranges,
    pieChart: categoryCounts
  });
});

module.exports = router;
