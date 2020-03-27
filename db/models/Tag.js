const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../../config/sequelize');

class Tag extends Model {
  static intensifiedValidationSchema() {
    return Joi.array().items(
      Joi.object({
        title: Joi.string()
          .min(1)
          .max(255)
          .required()
      })
    );
  }
}

Tag.init(
  {
    taggedId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    }
  },
  {
    sequelize,
    modelName: 'tag'
  }
);

module.exports = Tag;
