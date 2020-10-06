const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

const STRICT_PROJECT_REQ_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  date: Joi.date(),
  email: Joi.string().required().email().min(3).max(255),
  content: Joi.string().required(),
  submittedBy: Joi.string().required().min(1).max(255),
  phone: Joi.string().required().min(3).max(255)
});

class ProjectReq extends Model {
  static intensifiedValidation(projectReq) {
    return STRICT_PROJECT_REQ_SCHEMA.validate(projectReq);
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
  {
    sequelize
  }
);

module.exports = ProjectReq;
