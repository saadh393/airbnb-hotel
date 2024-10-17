'use strict';

const { SpotImage, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */

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
    })

    const spotIds = spots.map(spot => spot.id)

    await SpotImage.bulkCreate([
      {
        spotId: spotIds[0],
        url: "https://c.pxhere.com/photos/84/3b/cat_long_haired_cat_stubentieger_pet_blue_eye-1235432.jpg!d",
        preview: true
      },
      {
        spotId: spotIds[1],
        url: "https://th.bing.com/th/id/R.8e4ceca837f3c0ea996c744e2bc308a4?rik=4Q7cUWyUjTk4aQ&pid=ImgRaw&r=0",
        preview: true
      },
      {
        spotId: spotIds[2],
        url: "https://th.bing.com/th/id/R.abc16624e89e4210216c964211eff5a8?rik=F3urLBKZuB8c4g&pid=ImgRaw&r=0",
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
