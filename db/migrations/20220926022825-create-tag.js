'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      tag_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      tokoh: {
        allowNull: false,
        type: Sequelize.TEXT('tiny')
      },
      tempat: {
        allowNull: false,
        type: Sequelize.TEXT('tiny')
      },
      peristiwa: {
        allowNull: false,
        type: Sequelize.TEXT('tiny')
      },
      waktu: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('tags');
  }
};
