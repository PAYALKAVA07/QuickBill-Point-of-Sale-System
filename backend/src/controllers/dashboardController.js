const db = require('../models');
const { Op } = require('sequelize');

exports.getKPIs = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's sales
    const todayOrders = await db.Order.findAll({
      where: { createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } }
    });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // This month's revenue
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const monthOrders = await db.Order.findAll({
      where: { createdAt: { [Op.gte]: monthStart, [Op.lt]: monthEnd } }
    });
    const monthRevenue = monthOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // Total orders
    const totalOrders = await db.Order.count();

    // Total products
    const totalProducts = await db.Product.count();

    // Low stock items (below min alert)
    const lowStockItems = await db.Product.findAll({
      where: { stockQuantity: { [Op.lte]: db.sequelize.col('minStockAlert') } }
    });

    res.json({
      todayRevenue: todayRevenue.toFixed(2),
      monthRevenue: monthRevenue.toFixed(2),
      totalOrders,
      totalProducts,
      lowStockCount: lowStockItems.length
    });
  } catch (err) {
    next(err);
  }
};

exports.getDailySalesChart = async (req, res, next) => {
  try {
    const days = 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const orders = await db.Order.findAll({
        where: { createdAt: { [Op.gte]: date, [Op.lt]: nextDate } }
      });
      const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(revenue.toFixed(2)),
        orders: orders.length
      });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getTopProducts = async (req, res, next) => {
  try {
    // Get top 5 products by total quantity sold
    const topProducts = await db.OrderItem.findAll({
      attributes: [
        'productId',
        'name',
        [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalQty'],
        [db.sequelize.fn('SUM', db.sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      group: ['productId', 'name'],
      order: [[db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'DESC']],
      limit: 5,
      subQuery: false
    });

    const data = topProducts.map(p => ({
      name: p.name,
      quantity: parseInt(p.get('totalQty') || 0),
      revenue: parseFloat(p.get('totalRevenue') || 0).toFixed(2)
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    // Revenue by category
    const categories = await db.Category.findAll({
      include: [
        {
          model: db.Product,
          attributes: [],
          include: [
            {
              model: db.OrderItem,
              attributes: []
            }
          ]
        }
      ],
      attributes: [
        'id',
        'name',
        [db.sequelize.fn('SUM', db.sequelize.literal('Products->OrderItems.quantity * Products->OrderItems.price')), 'revenue']
      ],
      group: ['Category.id', 'Category.name'],
      subQuery: false,
      raw: true
    });

    const data = categories.map(c => ({
      name: c.name,
      revenue: parseFloat(c.revenue || 0).toFixed(2)
    })).filter(c => c.revenue > 0);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getRecentTransactions = async (req, res, next) => {
  try {
    const orders = await db.Order.findAll({
      order: [['id', 'DESC']],
      limit: 10,
      include: [{ model: db.Payment }]
    });

    const data = orders.map(o => ({
      id: o.id,
      invoiceNumber: o.invoiceNumber,
      total: parseFloat(o.total).toFixed(2),
      paymentMethod: o.paymentMethod,
      date: new Date(o.createdAt).toLocaleString()
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};
