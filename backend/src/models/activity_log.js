module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('ActivityLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING, allowNull: false },
    target: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT }
  }, { tableName: 'activity_logs', timestamps: false });
};
