module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
  }, { tableName: 'suppliers', timestamps: false });
};
