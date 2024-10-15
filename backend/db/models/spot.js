'use strict';
const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,
        {foreignKey: 'ownerId'}
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        len: [1, 50]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        len: [1, 50]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        len: [1, 50]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        len: [1, 50]
      }
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      Validate: {
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
