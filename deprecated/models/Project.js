const Joi = require('@hapi/joi');
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Tag = require('./Tag');
const Link = require('./Link');
const { removeImg } = require('../utils/fileSystem');

const STRICT_PROJECT_SCHEMA = Joi.object({
  id: Joi.string().uuid(),
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().required(),
  image: Joi.string(),
  links: Link.intensifiedValidationSchema(),
  tags: Tag.intensifiedValidationSchema()
});

class Project extends Model {
  static intensifiedValidation(project) {
    return STRICT_PROJECT_SCHEMA.validate(project);
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
      type: DataTypes.STRING,
      defaultValue: 'default/project.jpg'
    }
  },
  {
    sequelize,
    defaultScope: { subQuery: true, include: { all: true } },
    hooks: {
      beforeUpdate: async (project) => {
        const newImage = project.getDataValue('image');
        const oldImage = project.previous('image');
        const createdByUser = /^img/.test(oldImage);

        if (newImage && createdByUser) await removeImg(oldImage);
      },
      beforeDestroy: async (project) => {
        const image = project.getDataValue('image');
        const createdByUser = /^img/.test(image);

        if (createdByUser) await removeImg(image);
      }
    }
  }
);

const TagAssociationParams = { foreignKey: 'taggedId', constraints: false };
Project.hasMany(Tag, TagAssociationParams);
Tag.belongsTo(Project, TagAssociationParams);

const LinkAssociationParams = {
  foreignKey: 'linkableId',
  constraints: false
};
Project.hasMany(Link, LinkAssociationParams);
Link.belongsTo(Project, LinkAssociationParams);

module.exports = Project;
