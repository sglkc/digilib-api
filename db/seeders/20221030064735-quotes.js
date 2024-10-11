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
        text: 'Bahwa hidup harus menerima, penerimaan yang indah. Bahwa hidup' +
        ' harus dimengerti, pengertian yang benar. Bahwa hidup harus memahamim' +
          ' pemahaman yang tulus.',
        author: 'Tere Liye'
      },
      {
        text: 'Daun yang jatuh tak pernak membenci angin. Dia membiarkan' +
        ' dirinya jatuh begitu saja. Tak melawan. Mengikhlaskan semuanya.',
        author: 'Tere Liye, Daun Yang Jatuh Tak Pernah Membenci Angin'
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
