const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const PROFITABLE_PROJECT_REQUEST_SCHEMA = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().min(3).max(255).required(),
    phone: Joi.number().integer().positive().required(),
    about: Joi.string().required(),
    businessPlan: Joi.string(),
    systemDefinition: Joi.string().required().regex(urlRegex).message('invalid url'),
    communityOrProfit: Joi.string().valid('community', 'profit').required(),
    isFunded: Joi.boolean().required()
  })
};

class ProfitableProjectReq extends Model {
  static validate(reqBody, validationType) {
    return PROFITABLE_PROJECT_REQUEST_SCHEMA[validationType].validate(reqBody);
  }
}

ProfitableProjectReq.init(
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
    businessPlan: {
      type: DataTypes.TEXT
    },
    systemDefinition: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        len: [2, 255]
      }
    },
    communityOrProfit: {
      type: DataTypes.ENUM,
      values: ['community', 'profit']
    },
    isFunded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    }
  },
  {
    sequelize
  }
);

module.exports = ProfitableProjectReq;
