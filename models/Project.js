const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Project extends Model {
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
      title: Joi.string()
        .required()
        .min(1)
        .max(255),
      description: Joi.string().required()
    }).validate(list);
  }
}
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
        notNull: true
      }
    },
    description: { type: DataTypes.TEXT, validate: { notEmpty: true } }
    // preview: {} WHAT IS PREVIEW<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // links: ANOTHER MODEL
    // Tags: ANOTHER MODEL
  },
  { sequelize }
);

module.exports = Project;
