module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('StockAlert', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER },
    threshold: { type: DataTypes.INTEGER },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    message: { type: DataTypes.STRING }
  }, { tableName: 'stock_alerts', timestamps: false });
};
