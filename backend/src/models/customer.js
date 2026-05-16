module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT }
  }, { tableName: 'customers', timestamps: false });
};
