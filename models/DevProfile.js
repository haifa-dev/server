const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/database');

class DevProfile extends Model {
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
      name: Joi.string()
        .required()
        .min(1)
        .max(255),
      image: Joi.string().required(),
      bio: Joi.string().required(),
      email: Joi.string()
        .required()
        .email()
        .min(3)
        .max(255)
    }).validate(list);
  }
}

DevProfile.init(
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
      defaultValue: 'unknown',
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    },
    image: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
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
    }
    // Social: MIGHT IN ANOTHER MODEL
  },
  { sequelize }
);

module.exports = DevProfile;
