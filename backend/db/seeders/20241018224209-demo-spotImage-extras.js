'use strict';

const { SpotImage } = require('../models');

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

    await SpotImage.bulkCreate([
        {
          spotId: 1,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fanimal%2Fcat&psig=AOvVaw1o4RC8PajXmUPUynUIUocH&ust=1729373599554000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDar7zxmIkDFQAAAAAdAAAAABAE",
          preview: true
        },
        {
          spotId: 1,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.four-paws.org%2Fcampaigns-topics%2Ftopics%2Fcompanion-animals%2F10-facts-about-cats&psig=AOvVaw1o4RC8PajXmUPUynUIUocH&ust=1729373599554000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDar7zxmIkDFQAAAAAdAAAAABAJ",
          preview: false
        },
        {
          spotId: 2,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficatcare.org%2Fadvice%2Fthinking-of-getting-a-cat%2F&psig=AOvVaw1o4RC8PajXmUPUynUIUocH&ust=1729373599554000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDar7zxmIkDFQAAAAAdAAAAABAf",
          preview: true
        }
    ])
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
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
