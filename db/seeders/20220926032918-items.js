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
    await queryInterface.bulkInsert('items', [
      {
        title: 'Neuro Psikologi',
        author: 'Jalaludin Rakhmat',
        description: 'Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        cover: 'placeholder-1.jpg',
        media: 'placeholder.mp3',
        type: 'audio',
      },
      {
        title: 'Doa Bukan Lampu Aladin',
        author: 'Jalaludin Rakhmat',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolored eos qui ratione voluptatem.',
        cover: 'placeholder-2.jpg',
        media: 'placeholder.pdf',
        type: 'book',
      },
      {
        title: 'Neuro Psikologi',
        author: 'Jalaludin Rakhmat',
        description: 'Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        cover: 'placeholder-3.jpg',
        media: 'placeholder.mp4',
        type: 'video',
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
    await queryInterface.bulkDelete('items', null, {});
  }
};
