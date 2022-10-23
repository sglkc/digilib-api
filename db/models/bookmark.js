'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Item, { foreignKey: 'item_id' });
    }
  }
  Bookmark.init({
    bookmark_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER
  }, {
    defaultScope: {
      include: 'Item'
    },
    sequelize,
    modelName: 'Bookmark',
    tableName: 'bookmarks'
  });
  return Bookmark;
};
