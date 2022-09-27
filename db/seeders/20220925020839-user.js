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
    await queryInterface.bulkInsert('users', [{
      email: 'test@gmail.com',
      password: '$2a$12$yczoFQ2w29s83rGtrwo6Wum1gSAAUZTiZN9DzS91k1kSXKm0wG6Ii', // password
      nama: 'Test User',
      tanggal_lahir: '2000-12-31'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
