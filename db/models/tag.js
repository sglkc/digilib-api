'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tag.init({
    item_id: DataTypes.INTEGER,
    tokoh: DataTypes.TEXT,
    tempat: DataTypes.TEXT,
    peristiwa: DataTypes.TEXT,
    waktu: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'tag',
  });
  return Tag;
};
