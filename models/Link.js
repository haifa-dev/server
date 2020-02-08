const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Social = sequelize.define('Link', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255], notEmpty: true, notNull: true }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255], notEmpty: true, notNull: true, isUrl: true }
  }
});

module.exports = Social;
