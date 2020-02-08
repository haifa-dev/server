const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Tag = sequelize.define('tag', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255], notEmpty: true, notNull: true }
  }
});

module.exports = Tag;
