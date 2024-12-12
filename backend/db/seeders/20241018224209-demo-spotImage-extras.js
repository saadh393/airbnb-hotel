"use strict"

const { SpotImage } = require("../models")

let options = {}

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
        url: "https://www.rd.com/wp-content/uploads/2023/05/GettyImages-1341465008.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://media.npr.org/assets/img/2023/12/12/gettyimages-1054147940-627235e01fb63b4644bec84204c259f0a343e35b.jpg?s=1100&c=85&f=jpeg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.bing.com/images/search?view=detailV2&ccid=AXkYQMIL&id=0544F95C297C0A23702B7C2B0C7285B73350F86F&thid=OIP.AXkYQMIL02R0k7So1HzRWAHaE7&mediaurl=https%3a%2f%2fwww.rd.com%2fwp-content%2fuploads%2f2021%2f01%2fGettyImages-1253926491.jpg%3fresize%3d2048&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.01791840c20bd3647493b4a8d47cd158%3frik%3db%252fhQM7eFcgwrfA%26pid%3dImgRaw%26r%3d0&exph=1363&expw=2048&q=cats&simid=608004921464745196&FORM=IRPRST&ck=1914ADA698236BC477252A58540BED20&selectedIndex=4&itb=0",
        preview: true
      },
      {
        spotId: 1,
        url: "https://www.wfla.com/wp-content/uploads/sites/71/2023/05/GettyImages-1389862392.jpg?w=2560&h=1440&crop=1",
        preview: true
      },
      {
        spotId: 1,
        url: "https://images.squarespace-cdn.com/content/v1/607f89e638219e13eee71b1e/1684821560422-SD5V37BAG28BURTLIXUQ/michael-sum-LEpfefQf4rU-unsplash.jpg",
        preview: false
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "SpotImages"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2] }
      },
      {}
    )
  }
}
