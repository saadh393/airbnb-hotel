'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('spotImages', 'spotImages_spotId_fkey', options);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('spotImages', {
      fields: ['spotId'],
      type: 'foreign key',
      name: 'spotImages_spotId_fkey',
      references: {
        table: 'Spots',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }, options);
  }
};
