'use strict';

const { Booking, Spot, User } = require('../models');

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const spots = await Spot.findAll({
      attributes: ['id']
    });

    const users = await User.findAll({
      attributes: ['id']
    });

    const spotIds = spots.map(spot => spot.id);
    const userIds = users.map(user => user.id);

    await Booking.bulkCreate([
      {
        spotId: spotIds[0],
        userId: userIds[0],
        startDate: "2021-11-19",
        endDate: "2021-11-20"
      },
      {
        spotId: spotIds[1],
        userId: userIds[1],
        startDate: "2021-11-19",
        endDate: "2021-11-20"
      },
      {
        spotId: spotIds[2],
        userId: userIds[2],
        startDate: "2021-11-19",
        endDate: "2021-11-20"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
