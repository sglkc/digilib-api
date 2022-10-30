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
    await queryInterface.bulkInsert('quotes', [
      {
        text: 'Banyak jalan untuk mendekati Tuhan, sebanyak bilangan nafas' +
        ' para pencari Tuhan. Tapi jalan yang paling dekat pada Allah adalah' +
        ' membahagiakan orang lain di sekitarmu. Engkau berkhidmat kepada mereka.',
        author: 'Jalaluddin Rakhmat - The Road to Allah (hal.268)'
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
    await queryInterface.bulkDelete('quotes', null, {});
  }
};
