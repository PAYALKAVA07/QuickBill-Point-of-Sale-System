const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../controllers/authController');

router.get('/kpis', auth.protect, dashboardController.getKPIs);
router.get('/daily-sales', auth.protect, dashboardController.getDailySalesChart);
router.get('/top-products', auth.protect, dashboardController.getTopProducts);
router.get('/category-breakdown', auth.protect, dashboardController.getCategoryBreakdown);
router.get('/recent-transactions', auth.protect, dashboardController.getRecentTransactions);

module.exports = router;
