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
    await queryInterface.bulkInsert('tags', [
      {
        item_id: 1,
        tokoh: 'Tokoh 1',
        tempat: 'Bandung',
        peristiwa: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        waktu: '2005-12-31'
      },
      {
        item_id: 2,
        tokoh: 'Tokoh 2',
        tempat: 'Jakarta',
        peristiwa: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        waktu: '2010-06-16'
      },
      {
        item_id: 3,
        tokoh: 'Tokoh 3',
        tempat: 'Surabaya',
        peristiwa: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
        waktu: '2015-01-01'
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
    await queryInterface.bulkDelete('tags', null, {});
  }
};
