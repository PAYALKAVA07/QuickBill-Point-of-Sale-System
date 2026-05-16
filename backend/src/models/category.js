module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'categories', timestamps: false });
};
