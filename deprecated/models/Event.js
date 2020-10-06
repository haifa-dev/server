const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Tag = require('./Tag');
const { removeImg } = require('../utils/fileSystem');

const STRICT_EVENT_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  date: Joi.date().required(),
  title: Joi.string().required().min(1).max(255),
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
      type: DataTypes.STRING,
      defaultValue: 'default/event.jpg'
    }
  },
  {
    sequelize,
    defaultScope: { subQuery: true, include: { all: true } },
    hooks: {
      beforeUpdate: async (event) => {
        const newImage = event.getDataValue('image');
        const oldImage = event.previous('image');
        const createdByUser = /^img/.test(oldImage);

        if (newImage && createdByUser) await removeImg(oldImage);
      },
      beforeDestroy: async (event) => {
        const image = event.getDataValue('image');
        const createdByUser = /^img/.test(image);

        if (createdByUser) await removeImg(image);
      }
    }
  }
);

const associationParams = { foreignKey: 'taggedId', constraints: false };

Event.hasMany(Tag, associationParams);
Tag.belongsTo(Event, associationParams);

module.exports = Event;
