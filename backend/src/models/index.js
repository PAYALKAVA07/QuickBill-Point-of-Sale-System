const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,
  {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const db = { sequelize, Sequelize };

db.Role = require('./role')(sequelize);
db.User = require('./user')(sequelize);
db.Category = require('./category')(sequelize);
db.Supplier = require('./supplier')(sequelize);
db.Product = require('./product')(sequelize);
db.Order = require('./order')(sequelize);
db.OrderItem = require('./order_item')(sequelize);
db.Customer = require('./customer')(sequelize);
db.ActivityLog = require('./activity_log')(sequelize);

// Associations
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

db.Category.hasMany(db.Product, { foreignKey: 'categoryId' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.Supplier.hasMany(db.Product, { foreignKey: 'supplierId' });
db.Product.belongsTo(db.Supplier, { foreignKey: 'supplierId' });

db.Order.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Order, { foreignKey: 'userId' });

db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });
db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'productId' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId' });

db.User.hasMany(db.ActivityLog, { foreignKey: 'userId' });
db.ActivityLog.belongsTo(db.User, { foreignKey: 'userId' });

db.InventoryLog = require('./inventory_log')(sequelize);
db.StockAlert = require('./stock_alert')(sequelize);
db.Payment = require('./payment')(sequelize);

db.Product.hasMany(db.InventoryLog, { foreignKey: 'productId' });
db.InventoryLog.belongsTo(db.Product, { foreignKey: 'productId' });

db.Product.hasMany(db.StockAlert, { foreignKey: 'productId' });
db.StockAlert.belongsTo(db.Product, { foreignKey: 'productId' });

db.Order.hasOne(db.Payment, { foreignKey: 'orderId' });
db.Payment.belongsTo(db.Order, { foreignKey: 'orderId' });
module.exports = db;
