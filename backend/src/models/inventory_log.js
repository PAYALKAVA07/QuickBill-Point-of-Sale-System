module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('InventoryLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER },
    change: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('sale','restock','adjust'), allowNull: false },
    note: { type: DataTypes.STRING },
    beforeQuantity: { type: DataTypes.INTEGER },
    afterQuantity: { type: DataTypes.INTEGER }
  }, { tableName: 'inventory_logs', timestamps: false });
};
