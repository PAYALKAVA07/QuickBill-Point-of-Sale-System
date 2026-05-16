module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sku: { type: DataTypes.STRING, unique: true },
    barcode: { type: DataTypes.STRING, unique: true },
    categoryId: { type: DataTypes.INTEGER },
    costPrice: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    sellingPrice: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    taxPercentage: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    minStockAlert: { type: DataTypes.INTEGER, defaultValue: 0 },
    supplierId: { type: DataTypes.INTEGER },
    imageUrl: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('active','inactive'), defaultValue: 'active' }
  }, { tableName: 'products', timestamps: false });
};
