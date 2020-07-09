const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/sequelize');

const PROFIT_PROJECT_REQUEST_SCHEMA = {
  create: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    aboutProject: Joi.string().required(),
    businessType: Joi.string().required(),
    businessPlan: Joi.string().required(),
    linkToDocs: Joi.string().required(),
    systemDefinitionFile: Joi.string().required(),
    CommunityOrProfit: Joi.string().required(),
    isFunded: Joi.string().required()
  })
};

class ProfitProjectReq extends Model {
  static validate(reqBody, validationType) {
    return PROFIT_PROJECT_REQUEST_SCHEMA[validationType].validate(reqBody);
  }
}

ProfitProjectReq.init(
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
    businessPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { notEmpty: true, notNull: true }
    },
    linkToDocs: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isUrl: true
      }
    },
    systemDefinitionFile: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 255]
      }
    },
    CommunityOrProfit: {
      type: DataTypes.STRING,
      notNull: true,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    isFunded: {
      type: DataTypes.STRING,
      notEmpty: true,
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

module.exports = ProfitProjectReq;
