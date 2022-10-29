'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Item, { foreignKey: 'item_id', sourceKey: 'item_id' });
    }
  }
  History.init({
    history_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.NUMBER,
    item_id: DataTypes.NUMBER
  }, {
    defaultScope: {
      include: 'Item'
    },
    sequelize,
    modelName: 'History',
    tableName: 'histories'
  });
  return History;
};
