const db = require('../models');

exports.createOrder = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try{
    const { items, customerId, paymentMethod, discount = 0 } = req.body;
    if(!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    // Calculate totals
    let subtotal = 0;
    let tax = 0;
    for(const it of items){
      subtotal += parseFloat(it.price) * parseInt(it.quantity);
      tax += (parseFloat(it.tax || 0) * parseInt(it.quantity));
    }
    const total = subtotal + tax - parseFloat(discount || 0);

    // Create order
    const order = await db.Order.create({ invoiceNumber: `INV-${Date.now()}`, userId: req.user.id, customerId, subtotal, tax, discount, total, paymentMethod }, { transaction: t });

    // Process each item: check stock, deduct, create order item and inventory log
    for(const it of items){
      const product = await db.Product.findByPk(it.productId, { transaction: t, lock: t.LOCK.UPDATE });
      if(!product) throw new Error(`Product ${it.productId} not found`);
      const qty = parseInt(it.quantity);
      if(product.stockQuantity - qty < 0) throw new Error(`Insufficient stock for ${product.name}`);

      const before = product.stockQuantity;
      product.stockQuantity = product.stockQuantity - qty;
      await product.save({ transaction: t });

      await db.OrderItem.create({ orderId: order.id, productId: product.id, name: product.name, quantity: qty, price: it.price, tax: it.tax || 0 }, { transaction: t });

      await db.InventoryLog.create({ productId: product.id, change: -qty, type: 'sale', note: `Sale order ${order.id}`, beforeQuantity: before, afterQuantity: product.stockQuantity }, { transaction: t });

      // Create stock alert if below min
      if(product.stockQuantity <= product.minStockAlert){
        await db.StockAlert.create({ productId: product.id, threshold: product.minStockAlert, message: `Low stock for ${product.name}` }, { transaction: t });
      }
    }

    // Record payment
    await db.Payment.create({ orderId: order.id, amount: total, method: paymentMethod }, { transaction: t });

    await t.commit();
    res.json({ orderId: order.id, invoiceNumber: order.invoiceNumber });
  }catch(err){
    await t.rollback();
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try{
    const { page = 1, limit = 20, startDate, endDate, customerId, userId } = req.query;
    const where = {};
    if(startDate || endDate){
      where.createdAt = {};
      if(startDate) where.createdAt[db.Sequelize.Op.gte] = new Date(startDate);
      if(endDate) where.createdAt[db.Sequelize.Op.lte] = new Date(endDate);
    }
    if(customerId) where.customerId = customerId;
    if(userId) where.userId = userId;

    // Order by id desc (newest first). Using `createdAt` caused issues when the
    // DB schema did not expose Sequelize timestamps. Sorting by `id` is robust
    // and provides newest-first ordering for the orders list.
    const { count, rows } = await db.Order.findAndCountAll({ where, limit: +limit, offset: (+page-1)*limit, order: [['id','DESC']], include: [{ model: db.OrderItem }, { model: db.Payment }] });
    res.json({ total: count, page: +page, limit: +limit, data: rows });
  }catch(err){ next(err); }
};

exports.getOrder = async (req, res, next) => {
  try{
    const order = await db.Order.findByPk(req.params.id, { include: [{ model: db.OrderItem }, { model: db.Payment }] });
    if(!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  }catch(err){ next(err); }
};

// Invoice data for frontend rendering/export
exports.getInvoice = async (req, res, next) => {
  try{
    const order = await db.Order.findByPk(req.params.id, { include: [{ model: db.OrderItem }, { model: db.Payment }] });
    if(!order) return res.status(404).json({ message: 'Not found' });
    const store = {
      name: process.env.STORE_NAME || 'QuickBill Store',
      address: process.env.STORE_ADDRESS || 'Your Address',
      gst: process.env.STORE_GST || ''
    };
    res.json({ store, order });
  }catch(err){ next(err); }
};
