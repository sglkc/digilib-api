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
      // define association here
    }
  }
  Item.init({
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
    sequelize,
    modelName: 'item',
  });
  return Item;
};
