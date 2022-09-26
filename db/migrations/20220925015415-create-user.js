'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(20),
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(40),
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(60, true)
      },
      nama: {
        type: Sequelize.STRING(40)
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('users');
  }
};
