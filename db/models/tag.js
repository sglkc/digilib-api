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
    tag_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    item_id: DataTypes.INTEGER,
    tokoh: DataTypes.TEXT,
    tempat: DataTypes.TEXT,
    peristiwa: DataTypes.TEXT,
    waktu: DataTypes.DATE
  }, {
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    },
    sequelize,
    modelName: 'Tag',
    tableName: 'tags'
  });
  return Tag;
};
