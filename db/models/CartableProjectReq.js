const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/sequelize');

const CARTABLE_PROJECT_REQUEST_SCHEMA = {
  create: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    aboutProject: Joi.string().required(),
    businessType: Joi.string().required(),
    nonProfitDesc: Joi.string().required(),
    nonProfitWebSite: Joi.string().required(),
    nonProfitWebAddress: Joi.string().required(),
    nonProfitTasks: Joi.string().required()
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
    fullName: {
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 255],
        isNumeric: true,
        notEmpty: true,
        notNull: true
      }
    },
    aboutProject: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        min: 30
      }
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    nonProfitDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    nonProfitWebSite: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    nonProfitWebAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    nonProfitTasks: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true,
        min: 50
      }
    }
  },
  {
    sequelize
  }
);

module.exports = CartableProjectReq;
