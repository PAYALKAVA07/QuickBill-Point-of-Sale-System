module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 }
  }, { tableName: 'order_items', timestamps: false });
};
