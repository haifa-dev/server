const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');
const Link = require('./Link');
const { removeImg } = require('../utils/fileSystem');
const { generateImage } = require('../utils/fileSystem');

const STRICT_DEV_PROFILE_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string().required().min(1).max(255),
  image: Joi.string(),
  bio: Joi.string().required(),
  email: Joi.string().required().email().min(3).max(255),
  socials: Link.intensifiedValidationSchema()
});

class DevProfile extends Model {
  static intensifiedValidation(devProfile) {
    return STRICT_DEV_PROFILE_SCHEMA.validate(devProfile);
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
  },
  {
    sequelize,
    defaultScope: { subQuery: true, include: { all: true } },
    hooks: {
      beforeCreate: async devProfile => {
        if (!devProfile.getDataValue('image')) devProfile.image = await generateImage();
      },
      beforeUpdate: async devProfile => {
        if (devProfile.getDataValue('image')) {
          await removeImg(devProfile.previous('image'));
        }
      },
      beforeDestroy: async devProfile => {
        await removeImg(devProfile.previous('image'));
      }
    }
  }
);

const associationParams = { as: 'socials', foreignKey: { name: 'linkableId' }, constraints: false };

DevProfile.hasMany(Link, associationParams);
Link.belongsTo(DevProfile, associationParams);

module.exports = DevProfile;
