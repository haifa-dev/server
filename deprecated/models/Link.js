const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');

class Link extends Model {
  static intensifiedValidationSchema() {
    return Joi.array()
      .min(1)
      .max(20)
      .items(
        Joi.object({
          name: Joi.string().required(),
          url: Joi.string()
            .required()
            .regex(
              new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%.~#?&//=]*)/
              ),
              { name: 'url' }
            )
            .min(1)
            .max(255)
            .required()
        })
      );
  }
}

Link.init(
  {
    linkableId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255], notEmpty: true, notNull: true, isUrl: true }
    }
  },
  {
    sequelize,
    modelName: 'links'
  }
);

module.exports = Link;
