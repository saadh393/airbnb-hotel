'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove foreign key constraint
    await queryInterface.removeConstraint('spotImages', 'spotImages_spotId_fkey');
    // Drop the Spots table
    await queryInterface.dropTable('Spots');
    // Re-create the Spots table (if needed)
    await queryInterface.createTable('Spots', {
      // Define your columns here
    });
    // Re-add the foreign key constraint
    await queryInterface.addConstraint('spotImages', {
      fields: ['spotId'],
      type: 'foreign key',
      name: 'spotImages_spotId_fkey',
      references: {
        table: 'Spots',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse operations if needed
    await queryInterface.removeConstraint('spotImages', 'spotImages_spotId_fkey');
    await queryInterface.dropTable('Spots');
    // Add the constraint back
    await queryInterface.addConstraint('spotImages', {
      fields: ['spotId'],
      type: 'foreign key',
      name: 'spotImages_spotId_fkey',
      references: {
        table: 'Spots',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
