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
          url: "https://www.bing.com/images/search?view=detailV2&ccid=KKTsf3s2&id=0544F95C297C0A23702B98337974CFBE2331BC18&thid=OIP.KKTsf3s2OnwadSB-AwYAFQHaE1&mediaurl=https%3a%2f%2fwww.rd.com%2fwp-content%2fuploads%2f2021%2f01%2fGettyImages-1175550351.jpg%3fw%3d2141&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.28a4ec7f7b363a7c1a75207e03060015%3frik%3dGLwxI77PdHkzmA%26pid%3dImgRaw%26r%3d0&exph=1400&expw=2141&q=cats&simid=608041999893339317&FORM=IRPRST&ck=A22F0F6E5761A1830A0DFC7FB83BED2A&selectedIndex=2&itb=0",
          preview: true
        },
        {
          spotId: 1,
          url: "https://www.bing.com/images/search?view=detailV2&ccid=8EYPyCU4&id=C85C047CEE4BA45A3720419BA22A1E210930BA66&thid=OIP.8EYPyCU4GgOfq6qrzRH_OwAAAA&mediaurl=https%3a%2f%2fwww.rd.com%2fwp-content%2fuploads%2f2023%2f05%2fGettyImages-1341465008.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.f0460fc825381a039fabaaabcd11ff3b%3frik%3dZrowCSEeKqKbQQ%26pid%3dImgRaw%26r%3d0&exph=316&expw=474&q=cats&simid=608019833621389047&FORM=IRPRST&ck=19ED2D7C12FBEA754B248F4017CFCD05&selectedIndex=3&itb=0",
          preview: false
        },
        {
          spotId: 2,
          url: "https://www.bing.com/images/search?view=detailV2&ccid=AXkYQMIL&id=0544F95C297C0A23702B7C2B0C7285B73350F86F&thid=OIP.AXkYQMIL02R0k7So1HzRWAHaE7&mediaurl=https%3a%2f%2fwww.rd.com%2fwp-content%2fuploads%2f2021%2f01%2fGettyImages-1253926491.jpg%3fresize%3d2048&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.01791840c20bd3647493b4a8d47cd158%3frik%3db%252fhQM7eFcgwrfA%26pid%3dImgRaw%26r%3d0&exph=1363&expw=2048&q=cats&simid=608004921464745196&FORM=IRPRST&ck=1914ADA698236BC477252A58540BED20&selectedIndex=4&itb=0",
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
