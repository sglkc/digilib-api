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
        cover: 'http://cdn.medicalxpress.com/newman/gfx/news/2014/0318_cogsci-grades-orig.jpg',
        media: 'https://filesamples.com/samples/audio/mp3/sample1.mp3',
        type: 'audio',
      },
      {
        title: 'Doa Bukan Lampu Aladin',
        author: 'Jalaludin Rakhmat',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolored eos qui ratione voluptatem.',
        cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1332922051l/13563593.jpg',
        media: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Placeholder.pdf',
        type: 'book',
      },
      {
        title: 'Neuro Psikologi',
        author: 'Jalaludin Rakhmat',
        description: 'Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        cover: 'https://i.ytimg.com/vi/zxFWIa9mDIo/maxresdefault.jpg',
        media: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
