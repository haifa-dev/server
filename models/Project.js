const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Tag = require('../models/Tag');
const Link = require('../models/Link');

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
      description: Joi.string().required(),
      image: Joi.string(),
      links: Joi.array()
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
        ),
      tags: Joi.array().items(
        Joi.object({
          title: Joi.string()
            .min(1)
            .max(255)
            .required()
        })
      )
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
    description: { type: DataTypes.TEXT, validate: { notEmpty: true } },
    image: {
      type: DataTypes.STRING
    }
  },
  { sequelize }
);

const associationParams = {
  as: 'links',
  foreignKey: { name: 'projectId' }
};

Project.hasMany(Tag);
Tag.belongsTo(Project);

Project.hasMany(Link, associationParams);
Link.belongsTo(Project, associationParams);

module.exports = Project;
