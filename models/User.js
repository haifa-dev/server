const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');

class User extends Model {
  static validateAll(user) {
    return Joi.object({
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
    }).validate(user);
  }

  authUserChanged(authDate) {
    // saving document can delay after sign jwt token
    return authDate <= this.getDataValue('updatedAt').getTime() - 1000;
  }

  async generateResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.update({
      resetToken: crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'),
      resetTokenExpires: Date.now() + 20 * 60 * 1000
    });

    return resetToken;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  generateAuthToken() {
    return jwt.sign(
      {
        sub: this.id,
        aud: this.role,
        iat: new Date().getTime()
      },
      process.env.JWT_KEY,
      {
        expiresIn: '20d'
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
      defaultValue: 'unknown',
      validate: { len: [1, 255] }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'guide', 'lead-guide', 'admin']]
      }
    },
    resetToken: {
      type: DataTypes.STRING
    },
    resetTokenExpires: {
      type: DataTypes.DATE
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
