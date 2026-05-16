const db = require('../models');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const jsPDF = require('jspdf');

// Helper to convert date range
function getDateRange(startDate, endDate) {
  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const orders = await db.Order.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      include: [{ model: db.OrderItem }, { model: db.Payment }],
      order: [['id', 'DESC']]
    });

    const data = orders.map(o => ({
      InvoiceNumber: o.invoiceNumber,
      Date: new Date(o.createdAt).toLocaleDateString(),
      Items: o.OrderItems.length,
      Subtotal: parseFloat(o.subtotal),
      Tax: parseFloat(o.tax),
      Discount: parseFloat(o.discount),
      Total: parseFloat(o.total),
      PaymentMethod: o.paymentMethod
    }));

    const summary = {
      TotalOrders: data.length,
      TotalRevenue: data.reduce((s, d) => s + d.Total, 0).toFixed(2),
      TotalTax: data.reduce((s, d) => s + d.Tax, 0).toFixed(2),
      AverageOrderValue: (data.reduce((s, d) => s + d.Total, 0) / data.length).toFixed(2)
    };

    if (format === 'xlsx') return exportXLSX(res, 'Sales Report', data, summary);
    if (format === 'csv') return exportCSV(res, 'sales_report', data);
    if (format === 'pdf') return exportPDF(res, 'Sales Report', data, summary);

    res.json({ report: data, summary });
  } catch (err) {
    next(err);
  }
};

exports.getInventoryReport = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;

    const products = await db.Product.findAll({
      include: [{ model: db.Category }],
      order: [['stockQuantity', 'ASC']]
    });

    const data = products.map(p => ({
      SKU: p.sku,
      ProductName: p.name,
      Category: p.Category?.name || 'N/A',
      CostPrice: parseFloat(p.costPrice),
      SellingPrice: parseFloat(p.sellingPrice),
      CurrentStock: p.stockQuantity,
      MinAlert: p.minStockAlert,
      Status: p.stockQuantity <= p.minStockAlert ? 'Low' : 'Healthy',
      StockValue: (p.stockQuantity * parseFloat(p.costPrice)).toFixed(2)
    }));

    const summary = {
      TotalProducts: data.length,
      TotalStockValue: data.reduce((s, d) => s + parseFloat(d.StockValue), 0).toFixed(2),
      LowStockItems: data.filter(d => d.Status === 'Low').length
    };

    if (format === 'xlsx') return exportXLSX(res, 'Inventory Report', data, summary);
    if (format === 'csv') return exportCSV(res, 'inventory_report', data);
    if (format === 'pdf') return exportPDF(res, 'Inventory Report', data, summary);

    res.json({ report: data, summary });
  } catch (err) {
    next(err);
  }
};

exports.getProfitReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const orderItems = await db.OrderItem.findAll({
      include: [{ model: db.Order, where: { createdAt: { [Op.between]: [start, end] } } }, { model: db.Product }],
      attributes: [
        'id',
        'name',
        'quantity',
        'price',
        'tax',
        [db.sequelize.col('Product.costPrice'), 'costPrice']
      ]
    });

    const data = orderItems.map(oi => {
      const revenue = parseFloat(oi.price) * oi.quantity;
      const cost = parseFloat(oi.get('costPrice')) * oi.quantity;
      const profit = revenue - cost;
      return {
        ProductName: oi.name,
        Quantity: oi.quantity,
        UnitPrice: parseFloat(oi.price),
        UnitCost: parseFloat(oi.get('costPrice')),
        Revenue: revenue.toFixed(2),
        Cost: cost.toFixed(2),
        Profit: profit.toFixed(2),
        ProfitMargin: ((profit / revenue) * 100).toFixed(2) + '%'
      };
    });

    const summary = {
      TotalRevenue: data.reduce((s, d) => s + parseFloat(d.Revenue), 0).toFixed(2),
      TotalCost: data.reduce((s, d) => s + parseFloat(d.Cost), 0).toFixed(2),
      TotalProfit: data.reduce((s, d) => s + parseFloat(d.Profit), 0).toFixed(2),
      ProfitMargin: ((data.reduce((s, d) => s + parseFloat(d.Profit), 0) / data.reduce((s, d) => s + parseFloat(d.Revenue), 0)) * 100).toFixed(2) + '%'
    };

    if (format === 'xlsx') return exportXLSX(res, 'Profit Report', data, summary);
    if (format === 'csv') return exportCSV(res, 'profit_report', data);
    if (format === 'pdf') return exportPDF(res, 'Profit Report', data, summary);

    res.json({ report: data, summary });
  } catch (err) {
    next(err);
  }
};

exports.getTaxReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const orders = await db.Order.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      include: [{ model: db.OrderItem }]
    });

    const data = orders.map(o => ({
      InvoiceNumber: o.invoiceNumber,
      Date: new Date(o.createdAt).toLocaleDateString(),
      Subtotal: parseFloat(o.subtotal),
      TaxAmount: parseFloat(o.tax),
      TaxPercentage: (o.OrderItems.length > 0 ? parseFloat(o.OrderItems[0].tax || 0) : 0).toFixed(2),
      Total: parseFloat(o.total)
    }));

    const summary = {
      TotalOrders: data.length,
      TotalTaxable: data.reduce((s, d) => s + d.Subtotal, 0).toFixed(2),
      TotalTax: data.reduce((s, d) => s + d.TaxAmount, 0).toFixed(2),
      EffectiveTaxRate: ((data.reduce((s, d) => s + d.TaxAmount, 0) / data.reduce((s, d) => s + d.Subtotal, 0)) * 100).toFixed(2) + '%'
    };

    if (format === 'xlsx') return exportXLSX(res, 'Tax Report', data, summary);
    if (format === 'csv') return exportCSV(res, 'tax_report', data);
    if (format === 'pdf') return exportPDF(res, 'Tax Report', data, summary);

    res.json({ report: data, summary });
  } catch (err) {
    next(err);
  }
};

function exportXLSX(res, sheetName, data, summary) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${sheetName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`);
  
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  res.end(buf);
}

function exportCSV(res, filename, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.csv"`);
  res.end(csv);
}

function exportPDF(res, title, data, summary) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 10, 10);
  doc.setFontSize(10);
  
  let yPos = 20;
  Object.entries(summary).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 10, yPos);
    yPos += 7;
  });

  const tableData = data.slice(0, 10).map(row => Object.values(row));
  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  yPos += 5;
  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: yPos,
    theme: 'grid',
    fontSize: 8
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`);
  res.end(doc.output('arraybuffer'));
}
