const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const sequelize = require('../config/database');

class User extends Model {
  static async validateAll(user) {
    return await Joi.object({
      id: Joi.string().uuid(),
      email: Joi.string()
        .min(3)
        .max(255)
        .required()
        .email(),
      password: Joi.string()
        .min(1)
        .max(255)
        .required(),
      name: Joi.string()
        .min(1)
        .max(255)
    }).validateAsync(user);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  generateAuthToken() {
    const timestamp = new Date().getTime();
    return jwt.sign(
      {
        sub: this.id,
        // aud: this.role,
        iat: timestamp
      },
      process.env.JWT_KEY,
      {
        expiresIn: '2d'
      }
    );
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true, notNull: true, notEmpty: true, len: [3, 255] }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255], notNull: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unknown',
      validate: { len: [1, 255] }
    }
  },
  {
    sequelize,
    hooks: {
      beforeCreate: async user => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async user => {
        if (user.getDataValue('password') !== user.previous('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

module.exports = User;
