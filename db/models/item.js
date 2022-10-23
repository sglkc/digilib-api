'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Category, { foreignKey: 'item_id' });
      this.hasOne(models.Tag, { foreignKey: 'item_id' });
    }
  }
  Item.init({
    item_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    media: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM,
      values: ['audio', 'book', 'video']
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: ['Categories']
    },
    sequelize,
    modelName: 'Item',
    tableName: 'items'
  });
  return Item;
};
