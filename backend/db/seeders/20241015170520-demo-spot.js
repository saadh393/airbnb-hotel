"use strict"

const { Spot, User } = require("../models")
// const bcrypt = require("bcryptjs"); // shouldn't need because we're not handling any passwords or information that needs to be hashed/encoded

let options = {}
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */ // not present in demo-user seeder file

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
    try {
      const users = await User.findAll({
        attributes: ["id"]
      })

      // Map user IDs
      const userIds = users.map(user => user.id)

      await Spot.bulkCreate(
        [
          {
            ownerId: userIds[0],
            address: "123 Disney Lane",
            city: "San Francisco",
            state: "California",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "App Academy",
            description: "Place where web developers are created",
            price: 123
          },
          {
            ownerId: userIds[1],
            address: "611 McAnnelly Ave",
            city: "Devine",
            state: "Texas",
            country: "United States of America",
            lat: 29.14214,
            lng: -98.91284,
            name: "Xena's House",
            description: "Home",
            price: 250
          },
          {
            ownerId: userIds[2],
            address: "7613 Sugar Maple Ct",
            city: "Tyler",
            state: "Texas",
            country: "United States of America",
            lat: 32.26601,
            lng: -95.3256,
            name: "Dad's House",
            description: "Home Also",
            price: 500
          },
          {
            ownerId: userIds[2],
            address: "7613 Sugar Maple Ct",
            city: "Tyler",
            state: "Texas",
            country: "United States of America",
            lat: 32.26601,
            lng: -95.3256,
            name: "Raihan House",
            description: "Home Also",
            price: 500
          },
          {
            ownerId: userIds[1],
            address: "611 McAnnelly Ave",
            city: "Devine",
            state: "Texas",
            country: "United States of America",
            lat: 29.14214,
            lng: -98.91284,
            name: "Sawdahs House",
            description: "Home",
            price: 250
          },
          {
            ownerId: userIds[0],
            address: "123 Disney Lane",
            city: "San Francisco",
            state: "California",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "App Academy-3",
            description: "Place where web developers are created",
            price: 123
          },
          {
            ownerId: userIds[0],
            address: "123 Disney Lane",
            city: "San Francisco",
            state: "California",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "App Academy-4",
            description: "Place where web developers are created",
            price: 123
          },
          {
            ownerId: userIds[0],
            address: "123 Disney Lane",
            city: "San Francisco",
            state: "California",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "App Academy-5",
            description: "Place where web developers are created",
            price: 123
          }
        ],
        { validate: true }
      )
    } catch (error) {
      console.log(error.message)
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "App Academy",
            "Xena's House",
            "Dad's House",
            "Raihan House",
            "Sawdahs House",
            "App Academy-3",
            "App Academy-4",
            "App Academy-5"
          ]
        }
      },
      {}
    )
  }
}
