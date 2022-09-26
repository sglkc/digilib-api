'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(40)
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING(40)
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      cover: {
        allowNull: false,
        type: Sequelize.TEXT('tiny')
      },
      media: {
        allowNull: false,
        type: Sequelize.TEXT('tiny')
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('audio', 'book', 'video'),
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
  }
};
