'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(
        models.Spot,
        {foreignKey: 'ownerId'}
      ),
      User.hasMany(
        models.Booking,
        {foreignKey: 'userId'}
        ),
        User.hasMany(
          models.Review,
          {foreignKey: 'userId'}
        )
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 50],
            msg: "First name must be between 1 and 50 characters"
          },
          notEmpty: {
            args: "True",
            msg: "First name is required"
          },
          notNull: {
            args: "True",
            msg: "First name is required"
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 50],
            msg: "Last name must be between 1 and 50 characters"
          },
          notEmpty: {
            args: "True",
            msg: "Las name is required"
          },
          notNull: {
            args: "True",
            msg: "Last name is required"
          }
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
          notEmpty: {
            args: [true],
            msg: "Username is required"
          },
          notNull: {
            args: [true],
            msg: "Username is required"
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: {
            args: [true],
            msg: "Invalid email"
          },
          notEmpty: {
            args: [true],
            msg: "Email is required"
          },
          notNull: {
            args: [true],
            msg: "Email is required"
          }
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] }
        },
        loginUser: {
          attributes: {}
        }
      }
    }
  );
  return User;
};
