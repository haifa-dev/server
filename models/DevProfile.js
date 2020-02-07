const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/database');
const Social = require('./Social');

class DevProfile extends Model {
  static validateAll(devProfile) {
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
        .max(255),
      socials: Joi.array()
        .min(1)
        .max(255)
        .items(
          Joi.object({
            name: Joi.string().required(),
            url: Joi.string()
              .regex(
                new RegExp(
                  '^(https?:\\/\\/)?' + // protocol
                  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$',
                  'i'
                ),
                { name: 'url' }
              )
              .min(1)
              .max(255)
              .required()
          })
        )
    }).validate(devProfile);
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
  },
  { sequelize }
);

const associationParams = {
  as: 'socials',
  foreignKey: { name: 'devProfileId', allowNull: false }
};

DevProfile.hasMany(Social, associationParams);
Social.belongsTo(DevProfile, associationParams);

module.exports = DevProfile;
