'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Item, { sourceKey: 'item_id', foreignKey: 'item_id' });
    }
  }
  Category.init({
    category_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    item_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },
    sequelize,
    modelName: 'Category',
    tableName: 'categories'
  });
  return Category;
};
