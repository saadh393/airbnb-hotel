'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(
        models.Spot,
        {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
      User.hasMany(
        models.Booking,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
      User.hasMany(
        models.Review,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
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
            msg: "First name is required"
          },
          notNull: {
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
            msg: "Last name is required"
          },
          notNull: {
            msg: "Last name is required"
          }
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [4, 30],
            msg: "Username must be between 4 and 30 characters"
          },
          isNotEmail(value) {
            if (sequelize.Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
          notEmpty: {
            msg: "Username is required"
          },
          notNull: {
            msg: "Username is required"
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 256],
            msg: "Email must be between 3 and 256 characters"
          },
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
          attributes: { exclude: ["hashedPassword", "createdAt", "updatedAt"] }
        },
        loginUser: {
          attributes: { exclude: ["createdAt", "updatedAt"] }
        }
      }
    }
  );
  return User;
};
