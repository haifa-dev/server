const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProjectReq extends Model {
  static isUUID(id) {
    return Joi.object({
      id: Joi.string()
        .uuid()
        .required()
    }).validate({ id });
  }

  static validateAll(list) {
    return Joi.object({
      id: Joi.string().uuid(),
      date: Joi.date().required(),
      email: Joi.string()
        .required()
        .email()
        .min(3)
        .max(255),
      content: Joi.string().required(),
      submittedBy: Joi.string()
        .required()
        .required()
        .min(1)
        .max(255),
      phone: Joi.number()
        .positive()
        .integer()
    }).validate(list);
  }
}
ProjectReq.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 255]
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isInt: true,
        isNumeric: true,
        len: [3, 255]
      }
    },
    date: { type: DataTypes.DATE, validate: { isDate: true } },
    content: { type: DataTypes.TEXT, validate: { notEmpty: true } },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    }
  },
  { sequelize }
);

module.exports = ProjectReq;
