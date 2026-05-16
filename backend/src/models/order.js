module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER },
    customerId: { type: DataTypes.INTEGER },
    subtotal: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    discount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    paymentMethod: { type: DataTypes.STRING }
  }, { tableName: 'orders', timestamps: false });
};
