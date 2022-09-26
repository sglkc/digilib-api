'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Item, {
        as: 'bookmarks',
        through: models.Bookmark,
        otherKey: 'user_id',
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nama: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
