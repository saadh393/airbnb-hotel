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
        { foreignKey: 'spotId' }
      ),
        Review.belongsTo(
          models.User,
          { foreignKey: 'userId' }
        ),
        Review.hasMany(
          models.ReviewImage,
          { foreignKey: 'reviewId' }
        )
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
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Validate: {
        min: {
          args: [0],
          msg: 'Stars must be at least 0'
        },
        max: {
          args: [5],
          msg: 'Stars must be at most 5.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
