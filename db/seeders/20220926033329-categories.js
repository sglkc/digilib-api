'use strict';

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
    await queryInterface.bulkInsert('categories', [
      {
        item_id: 1,
        name: 'Sains dan Pendidikan',
      },
      {
        item_id: 1,
        name: 'Psikologi',
      },
      {
        item_id: 1,
        name: 'Komunikasi',
      },
      {
        item_id: 1,
        name: 'Neurosains',
      },
      {
        item_id: 2,
        name: 'Doa',
      },
      {
        item_id: 2,
        name: 'Agama',
      },
      {
        item_id: 3,
        name: 'Sains dan Pendidikan',
      },
      {
        item_id: 3,
        name: 'Psikologi',
      },
      {
        item_id: 3,
        name: 'Komunikasi',
      },
      {
        item_id: 3,
        name: 'Neurosains',
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('categories', null, {});
  }
};
