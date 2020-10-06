const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

const CARTABLE_PROJECT_REQUEST_SCHEMA = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().min(3).max(255).required(),
    phone: Joi.number().integer().positive().required(),
    about: Joi.string().required(),
    description: Joi.string().required(),
    webAddress: Joi.string().regex(urlRegex).required(),
    tasks: Joi.string().required()
  })
};

class CartableProjectReq extends Model {
  static validate(reqBody, validationType) {
    return CARTABLE_PROJECT_REQUEST_SCHEMA[validationType].validate(reqBody);
  }
}

CartableProjectReq.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 255],
        notEmpty: true,
        notNull: true
      }
    },
    email: {
      type: DataTypes.STRING,
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
      allowNull: false,
      validate: {
        len: [2, 255],
        isNumeric: true,
        notEmpty: true,
        notNull: true
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        min: 30
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    webAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tasks: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  },
  {
    sequelize
  }
);

module.exports = CartableProjectReq;
