const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Link = sequelize.define('link', {
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

module.exports = Link;
