const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Event extends Model {
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
      date: Joi.date()
        .required()
        .min(new Date().getDate()),
      title: Joi.string()
        .required()
        .min(1)
        .max(255),
      description: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string()
    }).validate(list);
  }
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: DataTypes.NOW
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unknown',
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    },
    description: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true }
    },
    location: { type: DataTypes.STRING },
    image: {
      type: DataTypes.STRING
    }
    // Tags: MIGHT IN ANOTHER MODEL
  },
  { sequelize }
);

module.exports = Event;
