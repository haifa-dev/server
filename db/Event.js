const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Tag = require('./Tag');
const { removeImg } = require('../utils/fileSystem');

const STRICT_EVENT_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  date: Joi.date().required(),
  title: Joi.string()
    .required()
    .min(1)
    .max(255),
  description: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string(),
  tags: Tag.intensifiedValidationSchema()
});

class Event extends Model {
  static intensifiedValidation(event) {
    return STRICT_EVENT_SCHEMA.validate(event);
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
  },
  {
    sequelize,
    hooks: {
      beforeUpdate: async event => {
        if (event.getDataValue('image')) await removeImg(event.previous('image'));
      },
      beforeDestroy: async event => {
        await removeImg(event.previous('image'));
      }
    }
  }
);

Event.hasMany(Tag);
Tag.belongsTo(Event);

module.exports = Event;
