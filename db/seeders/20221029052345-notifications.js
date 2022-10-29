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
    await queryInterface.bulkInsert('notifications', [
      {
        user_id: 1,
        text: 'Test notification'
      },
      {
        user_id: 1,
        text: 'Update Aplikasi telah tersedia'
      },
      {
        user_id: 1,
        text: 'Update Aplikasi telah tersedia'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
