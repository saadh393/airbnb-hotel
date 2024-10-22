'use strict';

const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(
        models.Spot,
        {
          foreignKey: "spotId",
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
      Review.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      );
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Review text is required"
        },
        notEmpty: {
          msg: "Review text is required"
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Stars must be an integer from 0 to 5'
        },
        max: {
          args: [5],
          msg: 'Stars must be an integer from 0 to 5'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
