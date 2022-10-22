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
        otherKey: 'item_id',
        foreignKey: 'user_id'
      });
      this.belongsToMany(models.Item, {
        as: 'histories',
        through: models.History,
        otherKey: 'item_id',
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nama: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY
  }, {
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    },
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
