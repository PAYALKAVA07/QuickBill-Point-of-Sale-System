module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    method: { type: DataTypes.STRING },
    transactionRef: { type: DataTypes.STRING }
  }, { tableName: 'payments', timestamps: false });
};
